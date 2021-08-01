const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { exec } = require("child_process");
const fs = require("fs");

const timeout = require("connect-timeout");
var fx = require("mkdir-recursive");
const ncp = require("ncp").ncp;
const cors = require("cors");
const csvWriter = require('csv-write-stream');

const util = require('util');
const {
    dominoPostProcess,
    separateActiveGenes,
    draftSessionDirectoryDetails,
    formatDate
} = require("./utils.js");
const fileStructure = require("./src/components/public/files_node");
const conf = require("./config.js").conf;
const freqData = require("./src/components/public/freq.js");

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "jade");

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger("dev"));

app.use(function(req, res, next) {
  res.set({
    "Access-Control-Allow-Origin": "http://" + "localhost"+ ":8000",
    "Access-Control-Allow-Headers": "X-Requested-With",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true"
  });
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/* Use cors and fileUpload*/
// app.use(cors());
app.use(fileUpload());

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

/*
app.get('/file_upload', ...);

app.get('/modules', ...);
* */

/* Promise wrappers. */
const makeDir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const execAsync = (cmd) => {
    /**
     * Executes a shell command and return it as a Promise.
     * @param cmd {string}
     * @return {Promise<string>}
     */
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
                reject(error);
            }
            console.log(stdout);
            console.log(stderr);
            resolve(stdout? stdout : stderr);
        });
    });
}

app.post("/upload", timeout("10m"), (req, res, next) => {
    console.log("Starting upload POST request ...");

    // create session directory (within the public folder)
    let fileNames = fileStructure.files.map(file => file.name);
    const userFileNames = fileNames.reduce(
        (obj, file) => ({
            ...obj,
            [file]: req.body[`${file} name`]
        }),{}); // input files to DOMINO selected by the user
    const [sessionDirectory, customFile] = draftSessionDirectoryDetails(userFileNames);
    fs.mkdirSync(sessionDirectory);

    // move network file to session directory
    // initialize values for the following variables
    let networkFilePath = req.body[`Network file path`];
    const cachedNetworkFile = networkFilePath;
    let mvNetworkFile, networkFileContents;
    if (cachedNetworkFile) {
        mvNetworkFile = execAsync(`cp ${networkFilePath} ${sessionDirectory}`);
        networkFileContents = readFile(networkFilePath);
    } else {
        let networkFile = req.files[`Network file contents`];
        networkFilePath = `${sessionDirectory}/${userFileNames["Network file"]}`;
        mvNetworkFile = networkFile.mv(networkFilePath);
        networkFileContents = new String(networkFile);
    }

    const sliceNetworkFile = execAsync(
        `bash slicer_runner.sh ` + [networkFilePath, `${networkFilePath}.slicer`, conf.DOMINO_PYTHON_ENV].join(' ')
    );

    const activeGenesSet = separateActiveGenes(new String(req.files["Active gene file contents"].data));
    const setNames = Object.keys(activeGenesSet);
    console.log("set names identified --> ", setNames.join(", "));

    const singleDOMINORun = async (serverNum, sessionDirectory, setName) => {
        /** Manages one run of DOMINO until completion of DOMINO postprocessing.
         * Returns a Promise.
         * Takes advantage of:
         *      activeGenesSet
         *      req
         *      userFileNames
         *      networkFilePath, cachedNetworkFile,
         *      networkFileContents (guaranteed to be resolved when this function runs)
         *      */
        console.log('Starting a single DOMINO run')
        const subRunDirectory = `${sessionDirectory}/${setName}`;
        const outputFile = `${subRunDirectory}/modules`;

        await makeDir(subRunDirectory);
        await makeDir(outputFile);

        // load the active gene file into the sub run directory
        const activeGenesFilePath = `${subRunDirectory}/active_gene_file.txt`;
        await writeFile(
            activeGenesFilePath,
            activeGenesSet[setName].join("\n")
        );

        console.log(`Starting domino py execution on set ${setName}...`);
        // question -> not sure why gdocker up after cd works but not the other way around?!
        let cmdArgs=[
                subRunDirectory,
                "active_gene_file.txt",
                `${subRunDirectory}/active_gene_file.txt`,
                networkFilePath,
                outputFile,
                conf.DOMINO_PYTHON_ENV,
                conf.AMI_PLUGINS_PYTHON_ENV
            ].join(" ");
        localExecution=`bash domino_runner.sh ${cmdArgs}`
        try {
            if (conf.REMOTE_EXECUTION){            
                console.log("About to start remote execution")
                execution=`ssh ${conf.USERNAME}@rack-shamir${serverNum}.cs.tau.ac.il "udocker run --volume /specific:/mnt/specific domino_updated bash -c 'cd /specific/netapp5/gaga/hagailevi/domino_web && ${localExecution}'"`
            }
            else{
                console.log("About to start local execution")
                execution=localExecution
            }
            await execAsync(execution);
        } catch (error) {
            console.log(`Error with DOMINO execution on set ${setName}.`);
            return Promise.reject(error);
        }

        console.log(`Reading the output of domino py on set ${setName} ...`);
        const dominoOutput = await readFile(`${outputFile}/modules.out`);
        const algOutput = dominoPostProcess(dominoOutput, networkFileContents);
        
        console.log(`DOMINO post process on set ${setName} ...`);
        console.log("numModules --> ", Object.keys(algOutput.modules).length);
        return {[setName]: algOutput};
    };

    Promise.all([mvNetworkFile, networkFileContents, sliceNetworkFile])
        .then(_ => {
            let serverBase = 3, serverOffset = 0, serverOffsetLimit = 3;
            return Promise.all(
                setNames.map(setName => {
                    let serverNum = serverBase + serverOffset;
                    serverOffset = (serverOffset + 1) % serverOffsetLimit;
                    return singleDOMINORun(serverNum, sessionDirectory, setName);
                })
            );
        })
        .then(listOfOutputs => {
            // update response with domino output

            const algOutputs = listOfOutputs.reduce((obj, output) =>
                    Object.assign(obj, output)
                , {});

            const geneSets = Object.keys(algOutputs).reduce((obj, setName) => ({
                ...obj,
                [setName]: Object.keys(algOutputs[setName].modules).length
            }), {});

            res.json({
                algOutput: algOutputs,
                ...((req.body["fromWebExecutor"] === "true") ?
                        {webDetails: {
                            geneSets: geneSets,
                            customFile: customFile,
                            zipURL: `${customFile}.zip`,
                        }}
                        : {}
                )
            });
        })
        .then(_ => {
            // finalize folder structure and create zip file

            const rmCachedFiles = exec(`rm ${sessionDirectory}/*.plk ${sessionDirectory}/*slicer`);

            console.log("Zipping solution ...");
            const zipFiles = execAsync(
                `cd ${sessionDirectory}/..
                zip -r ${customFile}.zip ${customFile}`
            );

            return Promise.all([rmCachedFiles, zipFiles]);
        })
        .then(_ => {
            // log execution details

            if (!fs.existsSync(conf.EXECUTION_CSV_DUMP))
                writer = csvWriter({ headers: ["time", "network_file"] });
            else
                writer = csvWriter({sendHeaders: false});

            writer.pipe(fs.createWriteStream(conf.EXECUTION_CSV_DUMP, {flags: 'a'}));

            writer.write({
                time: formatDate(new Date()),
                newtork_file: (cachedNetworkFile) ?
                    userFileNames["Network file"]
                    : "",
            });
            writer.end();

            const lastAggregation = new Date(freqData.lastAggregation);
            const ONE_HOUR = 60 * 60 * 1000; // in milliseconds
            if (((new Date()) - lastAggregation) > ONE_HOUR) {
                console.log("aggregating");
                return execAsync(`python3 aggregate_domino_execution.py test.csv src/components/public/freq.js`);
            }
        })
        .catch(error => {
            res.status(400);
        })
        .then(_ => res.end());
});

app.post("/getHTML", timeout("10m"), (req, res, next) => {
  console.log(req.body["filename"]);
  fs.readFile("public/"+req.body["filename"], function(err, data) {
    inner_html=new String(data);
    res.json({ inner_html: inner_html});
    res.end();
  });
});

app.use((err, req, res, next) => {
  // delegate to the default Express error handler, when the headers have already been sent to the client
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send('Something broke!');
});

app.listen(8000 || process.env.PORT || conf.PORT);


