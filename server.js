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

const util = require('util');
const {
    dominoPostProcess,
    separateActiveGenes,
    draftSessionDirectoryDetails
} = require("./utils.js");
const fileStructure = require("./src/components/public/files_node");
const conf = require("./config.js").conf;

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

app.get('/', function (req, res) {
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

    const activeGenesSet = separateActiveGenes(new String(req.files["Active gene file contents"].data));
    const setNames = Object.keys(activeGenesSet);

    let fileNames = fileStructure.files.map(file => file.name);
    const userFileNames = fileNames.reduce(
        (obj, file) => ({
            ...obj,
            [file]: req.body[`${file} name`]
        }),{}); // input files to DOMINO selected by the user

    const [sessionDirectory, customFile] = draftSessionDirectoryDetails(userFileNames);

    fs.mkdirSync(sessionDirectory);

    let networkFilePath = req.body[`Network file path`];
    let mvNetworkFile, networkFileContents, cachedNetworkFile;
    if (networkFilePath) {
        mvNetworkFile = execAsync(`cp ${networkFilePath} ${sessionDirectory}`); // this should be outside of this function
        networkFileContents = readFile(networkFilePath);
        cachedNetworkFile = 1;
    } else {
        let networkFile = req.files[`Network file contents`];
        networkFilePath = `${sessionDirectory}/${userFileNames["Network file"]}`;
        mvNetworkFile = networkFile.mv(networkFilePath);
        networkFileContents = new String(networkFile);
        cachedNetworkFile = 0;
    }

    const singleDOMINORun = async (sessionDirectory, setName) => {
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

        // load the active gene and network file into the session directory
        // prepare files for DOMINO run
        const activeGenesFilePath = `${subRunDirectory}/active_gene_file.txt`;
        await writeFile(
            activeGenesFilePath,
            activeGenesSet[setName].join("\n")
        );

        console.log(`Starting domino py execution on set ${setName}...`);
        let algExecutor = "bash domino_runner.sh " +
            [
                subRunDirectory,
                "active_gene_file.txt",
                `${subRunDirectory}/active_gene_file.txt`,
                networkFilePath,
                cachedNetworkFile,
                outputFile,
                conf.DOMINO_PYTHON_ENV,
                conf.AMI_PLUGINS_PYTHON_ENV
            ].join(" ");
        try {
            await execAsync(algExecutor);
        } catch (error) {
            console.log(`Error with DOMINO execution on set ${setName}.`);
            console.log(error)
            return Promise.reject(error);
        }


        console.log(`Reading the output of domino py on set ${setName} ...`);
        const dominoOutput = await readFile(`${outputFile}/modules.out`);

        const algOutput = dominoPostProcess(dominoOutput, networkFileContents);
        console.log(`DOMINO post process on set ${setName} ...`);
        console.log(
            `number of edges: ${algOutput.edges.length}\n` +
            `number of all_edges: ${algOutput.all_edges.length}\n` +
            `number of all_nodes: ${algOutput.all_nodes.length}\n`
        );
        return {[setName]: algOutput};
    };
    console.log(setNames)
    Promise.all([mvNetworkFile, networkFileContents])
        .then(_ =>
            Promise.all(
                setNames.map(setName => singleDOMINORun(sessionDirectory, setName))
            )
        )
        .then(listOfOutputs => {
            const algOutputs = listOfOutputs.reduce((obj, output) =>
                    Object.assign(obj, output)
                , {});

            const algOutput = algOutputs[setNames[0]];

            console.log(req.body["fromWebExecutor"]);
            console.log(typeof req.body["fromWebExecutor"]);
            console.log(req.body);

            res.json({
                algOutput: algOutput,
                ...((req.body["fromWebExecutor"] === "true") ?
                        {webDetails: {
                            numModules: Object.keys(algOutput.modules).length,
                            moduleDir: `${customFile}/${setNames[0]}/modules`,
                            zipURL: `${customFile}.zip`,
                        }}
                        :
                        {}
                )
            });
        })
        .then(_ => {
            const rmCachedFiles = exec(`rm ${sessionDirectory}/*.plk ${sessionDirectory}/*slicer`);

            console.log("Zipping solution ...");
            const zipFiles = execAsync(
                `cd ${sessionDirectory}/..
                zip -r ${customFile}.zip ${customFile}`
            );

            return Promise.all([rmCachedFiles, zipFiles]);
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

app.listen(process.env.PORT || 8000);



