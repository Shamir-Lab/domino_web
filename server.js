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
const app = express();
const { dominoPostProcess } = require("./utils.js");

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
    let timestamp = (new Date()).getTime(); // the number of elapsed milliseconds since Jan 1, 1970

    let strip_extension = (str) => {
        /* Returns the string's base name before any ".txt" or ".sif" extension. */
        return str.slice(0, str.indexOf("."));
    };
    let fileNames = fileStructure.files.map(file => file.name);
    let customFile = [
        ...fileNames.map(file => strip_extension(req.body[`${file} name`])),
        timestamp
    ].join("@");
    let userDirectory = `${__dirname}/public/${customFile}`;
    fs.mkdirSync(userDirectory);
    fs.mkdirSync(userDirectory + "/modules"); // to store the output of DOMINO

    // upload files to userDirectory
    const fileUploadPromises = fileNames.map(file => {
      let fileName = req.body[`${file} name`];
      let fileContents = req.files[`${file} contents`];
      if (fileName === "") {
          return; // potential source of bug
      }

      return fileContents.mv(`${userDirectory}/${fileName}`);
    });

    Promise.all(fileUploadPromises).then(_ => {
        console.log("Starting domino py execution ...");
        let algExecutor =
            `bash domino_runner.sh ${userDirectory} ${req.body["Active gene file name"]} ${req.body["Network file name"]} modules ${conf.DOMINO_PYTHON_ENV} ${conf.AMI_PLUGINS_PYTHON_ENV}`;
        execSync(algExecutor);

        console.log("Reading the output of domino py ...");
        const file_output_data = fs.readFileSync(userDirectory+"/modules/modules.out");

        console.log("Zipping solution ...");
        execSync(
            `cd ${userDirectory}/..
            zip -r ${customFile}.zip ${customFile}`
        );

        console.log("DOMINO post process ...");
        const algOutput = dominoPostProcess(file_output_data, req.files["Network file contents"].data);
        console.log(
            `number of edges: ${algOutput.edges.length}\n` +
            `number of all_edges: ${algOutput.all_edges.length}\n` +
            `number of all_nodes: ${algOutput.all_nodes.length}\n`
        );
        console.log(algOutput.modules, Object.keys(algOutput.modules))
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



