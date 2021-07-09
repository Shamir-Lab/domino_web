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
            }
            console.log(stdout);
            resolve(stdout? stdout : stderr);
        });
    });
}

app.post("/upload", timeout("10m"), (req, res, next) => {
    console.log("Starting upload POST request ...");

    let fileNames = fileStructure.files.map(file => file.name);
    const userFileNames = fileNames.reduce(
        (obj, file) => ({
            ...obj,
            [file]: req.body[`${file} name`]
        }),{}); // input files to DOMINO selected by the user

    const [sessionDirectory, customFile] = draftSessionDirectoryDetails(userFileNames);

    fs.mkdirSync(sessionDirectory);

    const activeGenesSet = separateActiveGenes(new String(req.files["Active gene file contents"].data));
    const setNames = Object.keys(activeGenesSet);
    
    const singleDOMINORun = async (sessionDirectory, setName) => {
        /** Manages one run of DOMINO until completion of DOMINO postprocessing.
         * Returns a Promise.
         * Takes advantage of:
         *      activeGenesSet
         *      req
         *      userFileNames
         *      */

        const subRunDirectory = `${sessionDirectory}/${setName}`;

        await makeDir(`${subRunDirectory}`);
        await makeDir(`${subRunDirectory}/modules`);

        // active gene file
        let p1 = writeFile(
            `${subRunDirectory}/active_gene_file.txt`,
            activeGenesSet[setName].join("\n")
        );

        // network file
        let p2;
        let filePath = req.body[`Network file path`];
        if (filePath) {
            p2 = execAsync(`cp ${filePath} ${subRunDirectory}`);
        } else {
            let fileContents = req.files[`Network file contents`];
            p2 = fileContents.mv(`${subRunDirectory}/${userFileNames["Network file"]}`);
        }

        await Promise.all([p1, p2]); // load the active gene and network file

        console.log(`Starting domino py execution on set ${setName}...`);
        let algExecutor =
            `bash domino_runner.sh ${subRunDirectory} active_gene_file.txt ${userFileNames["Network file"]} modules ${conf.DOMINO_PYTHON_ENV} ${conf.AMI_PLUGINS_PYTHON_ENV}`;
        await execAsync(algExecutor);

        /*
        console.log(`Reading the output of domino py and network file for set ${setName} ...`);
        p1 = readFile(`${subRunDirectory}/modules/modules.out`);
        p2 = readFile(`${subRunDirectory}/${userFileNames["Network file"]}`);

        return Promise.all([p1, p2])
            .then((dominoOutput, networkFileData) => {
                console.log(new String(dominoOutput), new String(networkFileData));
                const algOutput = dominoPostProcess(dominoOutput, networkFileData);
                console.log(algOutput);
                console.log(`DOMINO post process on set ${setName} ...`);
                console.log(
                    `number of edges: ${algOutput.edges.length}\n` +
                    `number of all_edges: ${algOutput.all_edges.length}\n` +
                    `number of all_nodes: ${algOutput.all_nodes.length}\n`
                );
                allAlgOutput[setName] = algOutput;
            });

         */


        console.log(`Reading the output of domino py on set ${setName} ...`);
        const dominoOutput = await readFile(
            `${subRunDirectory}/modules/modules.out`
        );

        const algOutput = dominoPostProcess(
            dominoOutput,
            fs.readFileSync(`${subRunDirectory}/${userFileNames["Network file"]}`)
        );
        console.log(`DOMINO post process on set ${setName} ...`);
        console.log(
            `number of edges: ${algOutput.edges.length}\n` +
            `number of all_edges: ${algOutput.all_edges.length}\n` +
            `number of all_nodes: ${algOutput.all_nodes.length}\n`
        );
        // allAlgOutput[setName] = algOutput;
        return {[setName]: algOutput};
    };

    const dominoRunPromises = setNames.map(setName =>
        singleDOMINORun(sessionDirectory, setName)
    );

    Promise.all(dominoRunPromises)
        .then(listOfOutputs => {
            const algOutputs = listOfOutputs.reduce((obj, output) =>
                Object.assign(obj, output)
            , {});

            const algOutput = algOutputs[setNames[0]];
            res.json({
                algOutput: algOutput,
                webDetails: {
                    numModules: Object.keys(algOutput.modules).length,
                    moduleDir: `${customFile}/${setNames[0]}/modules`,
                    zipURL: `${customFile}.zip`,
                }
            });
        })
        .then(_ => {
            console.log("Zipping solution ...");
            return execAsync(
                `cd ${sessionDirectory}/..
                zip -r ${customFile}.zip ${customFile}`
            )
        }).then(_ => res.end());

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
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(process.env.PORT || 8000);



