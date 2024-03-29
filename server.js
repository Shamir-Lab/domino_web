const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { exec } = require("child_process");
const fs = require("fs");
const timeout = require("connect-timeout");
// const ncp = require("ncp").ncp;
// const cors = require("cors");

const {
    dominoPostProcess,
    separateActiveGenes,
    draftSessionDirectoryDetails,
    hasNonAlphaNumericChars,
    hasExpectedFileExtension,
    formatDate,
    convert2Ensg
} = require("./utils.js");
const {
    addExecution,
    aggregateExecutions,
    aggregateGit,
    aggregateBioconda,
    aggregatePypi,
    createDummyValues
} = require("./db_helper.js");
const errorMsgs=require("./errors.js")
const fileStructure = require("./src/components/public/files_node");
const conf = require("./config.js").conf;

const mongoose = require('mongoose');

/** Database setup */
//const uri = "mongodb://nimsi:H9mEnJNgwLYeRqm6@cluster0.fj8em.mongodb.net/executions?retryWrites=true&w=majority";
//mongoose.set('bufferCommands', false); // temporary
//const uri = 'mongodb://127.0.0.1/executions';
//mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
//    .then(() => console.log("Successful MongoDB connection."));
//const db = mongoose.connection;
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));


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

/* Promise wrappers. */
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

app.get("/aggregated-usage", async (req, res, next) => {
    // aggregate
    console.log("Aggregating");
    let [totalExecutions, networkExecutions, monthlyExecutionsByNetworks] = await aggregateExecutions();
    let [yearlyGit, monthlyGit] = await aggregateGit();
    let [yearlyBioconda, monthlyBioconda] = await aggregateBioconda();
    let [yearlyPypi, monthlyPypi] = await aggregatePypi();

    console.log(yearlyPypi)
    console.log(monthlyPypi)
    console.log("Done aggregating");

    // post processing
    networkExecutions = networkExecutions.map((usage) => {
        return {
            network: usage._id,
            freq: usage.freq
        };
    });

    res.json({
        totalExecutions: totalExecutions[0],
        networkExecutions: networkExecutions,
        monthlyExecutionsByNetworks: monthlyExecutionsByNetworks,
        yearlyGit: yearlyGit[0],
        monthlyGit: monthlyGit,
        yearlyBioconda: yearlyBioconda[0],
        monthlyBioconda: monthlyBioconda,
        yearlyPypi: yearlyPypi[0],
        monthlyPypi: monthlyPypi
    });

    res.end();
});

app.post("/upload", timeout("20m"), (req, res, next) => {
    console.log("Starting upload POST request ...");

    // create session directory (within the public folder)
    let fileNames = fileStructure.files.map(file => file.name);

    const userFileNames = fileNames.reduce(
        (obj, file) => ({
            ...obj,
            [file]: req.body[`${file} name`]
        }),{}); // input files to DOMINO selected by the user

    if (! hasExpectedFileExtension(userFileNames["Active gene file"], "txt") || ! hasExpectedFileExtension(userFileNames["Network file"], "sif")){
       res.status(400).send(errorMsgs.invalidFileExtension);
       return;
       
    }
    const isInvalidFileNames=Object.values(userFileNames).map((cur) => cur.split('.').slice(0,-1).join('.')).reduce((agg,cur)=>{return agg || hasNonAlphaNumericChars(cur)}, false);
    if (isInvalidFileNames){
       res.status(400).send(errorMsgs.invalidAlphaNumericFileName);
       return; 
    }

   const [sessionDirectory, customFile] = draftSessionDirectoryDetails(userFileNames);
    fs.mkdirSync(sessionDirectory);

    // move network file to session directory
    // initialize values for the following variables
    let networkFilePath = req.body[`Network file path`];
    const cachedNetworkFile = networkFilePath;
    let mvNetworkFile, networkFileContents;
    if (cachedNetworkFile) {
        networkFileContents = fs.promises.readFile(networkFilePath);
    } else {
        let networkFile = req.files[`Network file contents`];
        networkFilePath = `${sessionDirectory}/${userFileNames["Network file"]}`;
        mvNetworkFile = networkFile.mv(networkFilePath);
        networkFileContents = new String(networkFile);
    }

    const sliceNetworkFile = execAsync(
        `bash runners/slicer.sh ` + [`"${networkFilePath}"`, `${networkFilePath}.slicer`, conf.DOMINO_PYTHON_ENV].join(' ')
    );

    let activeGenesSet = separateActiveGenes(new String(req.files["Active gene file contents"].data));
    const setNames = Object.keys(activeGenesSet);
    const isInvalidActiveGeneSetNames=Object.values(setNames).reduce((agg,cur)=>{return agg || hasNonAlphaNumericChars(cur)}, false);
    if (cachedNetworkFile){
        activeGenesSet = convert2Ensg(activeGenesSet);
        console.log(activeGenesSet)
    }

    if (isInvalidActiveGeneSetNames){
           res.status(400).send(errorMsgs.invalidAlphaNumericSetName);
       return;
   }

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

        
        await fs.promises.mkdir(subRunDirectory);
        await fs.promises.mkdir(outputFile);

        // load the active gene file into the sub run directory
        const activeGenesFilePath = `${subRunDirectory}/active_gene_file.txt`;
        await fs.promises.writeFile(
            activeGenesFilePath,
            activeGenesSet[setName].join("\n")
        );

        console.log(`Starting domino py execution on set ${setName}...`);
        // question -> not sure why gdocker up after cd works but not the other way around?!
        let cmdArgs=[
                `"${subRunDirectory}"`,
                "active_gene_file.txt",
                `"${subRunDirectory}/active_gene_file.txt"`,
                `"${networkFilePath}"`,
                `"${outputFile}"`,
                conf.DOMINO_PYTHON_ENV,
                conf.AMI_PLUGINS_PYTHON_ENV
            ].join(" ");
        localExecution=`bash runners/domino.sh ${cmdArgs}`
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
        const dominoOutput = await fs.promises.readFile(`${outputFile}/modules.out`);
        const algOutput = dominoPostProcess(dominoOutput, networkFileContents);
        
        console.log(`DOMINO post process on set ${setName} ...`);
        console.log("modules --> ", algOutput.modules);
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


            console.log(JSON.stringify({
                algOutput: algOutputs,
                ...((req.body["fromWebExecutor"] === "true") ?
                        {webDetails: {
                            geneSets: geneSets,
                            customFile: customFile,
                            zipURL: `${customFile}.zip`,
                        }}
                        : {}
                )
            }));


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
            // finalize folder structure, create zip file, and log execution details

            const rmCachedFiles = exec(`rm ${sessionDirectory}/*.plk ${sessionDirectory}/*slicer`);

            console.log("Zipping solution ...");
            const zipFiles = execAsync(
                `cd "${sessionDirectory}/.."
                zip -r "${customFile}.zip" "${customFile}"`
            );

            const logExec = addExecution(userFileNames["Network file"], !cachedNetworkFile);

            return Promise.all([rmCachedFiles, zipFiles, logExec]);
        })
        .catch(error => {
            console.log(error);
            res.status(400).send(errorMsgs.nonSpecific);
        })
        .then(_ => res.end());
});

app.get('/*', function (req, res) { // why "/*"?
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.use((err, req, res, next) => {
  // delegate to the default Express error handler, when the headers have already been sent to the client
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send('Something broke!');
});

app.listen(conf.PORT || 8000);


