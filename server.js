const fileStructure = require("./src/components/public/files_node");
const express = require("express"); //
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { exec, execSync } = require("child_process");
const fs = require("fs");
const ncp = require("ncp").ncp;
const conf = require("./config.js").conf;
const timeout = require("connect-timeout");
var fx = require("mkdir-recursive");
const util = require('util')
const app = express();
const { dominoPostProcess, separateActiveGenes } = require("./utils.js");

app.use(express.static(path.join(__dirname, 'build')));

// Require static assets from public folder
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

app.post("/upload", timeout("10m"), (req, res, next) => {
    console.log("Starting upload POST request ...");

    // make userDirectory, which stores the user's file on the server
    let timestamp = (new Date()).getTime();

    let strip_extension = (str) => {
        /* Returns the string's base name before any ".txt" or ".sif" extension. */
        return str.slice(0, str.indexOf("."));
    };

    let fileNames = fileStructure.files.map(file => file.name);
    const userFileNames = fileNames.reduce(
        (obj, file) => ({
            ...obj,
            [file]: req.body[`${file} name`]
        }),{}); // input files to DOMINO selected by the user

    let customFile = [
        ...Object.values(userFileNames).map(userFileName => strip_extension(userFileName)),
        timestamp
    ].join("@");
    let userDirectory = `${__dirname}/public/${customFile}`;
    fs.mkdirSync(userDirectory);

    // sub runs directory

    const activeGeneContent = new String(req.files["Active gene file contents"].data);
    const activeGenesSet = separateActiveGenes(activeGeneContent);
    const setNames = Object.keys(activeGenesSet);
    const allAlgOutput = {};
    setNames.map(setName => {
        const subRunDirectory = `${userDirectory}/${setName}`;

        fs.mkdirSync(`${subRunDirectory}`);
        fs.mkdirSync(`${subRunDirectory}/modules`);

        // active gene file
        fs.writeFileSync(
                `${subRunDirectory}/active_gene_file.txt`,
                activeGenesSet[setName].join("\n")
            );

        // network file
        let filePath = req.body[`Network file path`];
        if (filePath) {
            execSync(`cp ${filePath} ${subRunDirectory}`);
        } else {
            let fileContents = req.files[`Network file contents`];
            fileContents.mv(`${subRunDirectory}/${userFileNames["Network file"]}`);
        }

        console.log(`Starting domino py execution on set ${setName}...`);
        let algExecutor =
            `bash domino_runner.sh ${subRunDirectory} active_gene_file.txt ${userFileNames["Network file"]} modules ${conf.DOMINO_PYTHON_ENV} ${conf.AMI_PLUGINS_PYTHON_ENV}`;
        execSync(algExecutor);

        console.log(`Reading the output of domino py on set ${setName} ...`);
        const dominoOutput = fs.readFileSync(
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
        allAlgOutput[setName] = algOutput;
    });

    execSync(`ls -LR ${userDirectory}`, {stdio: "inherit"});

    console.log("Zipping solution ...");
    execSync(
        `cd ${userDirectory}/..
            zip -r ${customFile}.zip ${customFile}`
    );

    const algOutput = allAlgOutput[setNames[0]];
    res.json({
        algOutput: algOutput,
        webDetails: {
            numModules: Object.keys(algOutput.modules).length,
            moduleDir: `${userDirectory}/${setNames[0]}/modules`,
            zipURL: `${customFile}.zip`,
        }
    });
    res.end();

    /*
    Promise.all(fileUploadPromises).then(_ => {
        console.log("Starting domino py execution ...");
        let algExecutor =
            `bash domino_runner.sh ${userDirectory} ${userFileNames["Active gene file"]} ${userFileNames["Network file"]} modules ${conf.DOMINO_PYTHON_ENV} ${conf.AMI_PLUGINS_PYTHON_ENV}`;
        execSync(algExecutor);

        console.log("Reading the output of domino py ...");
        const file_output_data = fs.readFileSync(userDirectory+"/modules/modules.out");

        console.log("Zipping solution ...");
        execSync(
            `cd ${userDirectory}/..
            zip -r ${customFile}.zip ${customFile}`
        );

        console.log("DOMINO post process ...");
        const algOutput = dominoPostProcess(file_output_data, fs.readFileSync(userDirectory + "/" + userFileNames["Network file"]));
        console.log(
            `number of edges: ${algOutput.edges.length}\n` +
            `number of all_edges: ${algOutput.all_edges.length}\n` +
            `number of all_nodes: ${algOutput.all_nodes.length}\n`
        );

        res.json({
            algOutput: algOutput,
            webDetails: {
                numModules: Object.keys(algOutput.modules).length,
                moduleDir: `${customFile}/modules`,
                zipURL: `${customFile}.zip`,
            }
        });
        res.end();
    });
     */

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



