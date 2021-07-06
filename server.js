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

  // make directory to store user's file on server
  let timestamp = (new Date()).getTime(); // the number of elapsed milliseconds since Jan 1, 1970
  let strip_extension = (str) => {
    return str.slice(0, str.indexOf("."));
  };
  let customFile = [
    strip_extension(req.body["Active gene file name"]),
    strip_extension(req.body["Network file name"]),
    timestamp
  ].join("@");
  let userDirectory = `${__dirname}/public/${customFile}`;
  fs.mkdirSync(userDirectory);
  fs.mkdirSync(userDirectory + "/modules"); // to store the output of DOMINO

  fileUploadPromises = [];
  let fileNames = fileStructure.files.map(file => file.name);
  try {
    /** @author: Nima Rahmanian
     * Moves the user's uploaded files to a directory accessible by the
     * DOMINO algorithm.
     * @param response: the POST request response object.
     * @returns: a Promise (to move the file)
     * */
    const moveFile = (userDirectory, fileName, fileContents, response) => {
      return new Promise((resolve, reject) => {
        if (fileName === "") {
          resolve("");
        } else {
          fileContents.mv(`${userDirectory}/${fileName}`, err => {
            if (err) {
              console.log("error while moving file: \n" + err);
              resolve();
              response.status(err.status || 500);
              response.render("error");
              return; // is this necessary?
            } else {
              console.log("moved " + fileName);
              resolve(fileName);
            }
          });
        }
      });
    }

    fileNames.map(file => {
      let fileName = req.body[`${file} name`];
      let fileContents = req.files[`${file} contents`];
      fileUploadPromises.push(moveFile(userDirectory, fileName, fileContents, res));
    });
    Promise.all(fileUploadPromises);
  } catch (e) {
    next(e);
  }

  console.log("Starting domino py execution ...");
  let algExecutor =
      `bash domino_runner.sh ${userDirectory} ${req.body["Active gene file name"]} ${req.body["Network file name"]} ${userDirectory}/modules ${conf.PYTHON_ENV}`;
  try {
    execSync(algExecutor);
  } catch (e) {
    next(e);
  }

  try {
    execSync(
        `cd ${userDirectory}/..
                    zip -r ${customFile}.zip ${customFile}`,
        { stdio: 'inherit' }
    );
  } catch (e) {
    console.log(e);
    return;
  }

  const dominoPostProcess = (stdout, networkFileData) => {
    console.log("DOMINO post process ...");

    const py_output = new String(stdout);
    const modules_str = py_output.split("\n");
    const module_to_genes={};
    let nodes=[];
    for (i=0;i<modules_str.length;i++){
      cur_module=modules_str[i].substring(1,modules_str[i].length-2).split(", ");
      module_to_genes[i] = cur_module;
      nodes=nodes.concat(cur_module);
    }
    let module_to_genes_arr = [];
    let nodes_ids = []
    for (module in module_to_genes) {
      module_to_genes_arr.push({ [module]: module_to_genes[module] });
      nodes_ids.concat(module_to_genes[module])
    }
    // nodes_ids = module_to_genes_arr.reduce((x, y) => {
    //   x.concat(y);}, []);

    let nw = new String(networkFileData);
    let nw_edges = nw
        .trim()
        .split("\n")
        .map(cur => {
          let x = cur.split("\t");
          x.splice(1, 1);
          return x;
        });

    let edges = [];
    for (var i = 0; i < nw_edges.length; i++) {
      for (module in module_to_genes) {
        if (
            module_to_genes[module].indexOf(nw_edges[i][0]) != -1 &&
            module_to_genes[module].indexOf(nw_edges[i][1]) != -1
        ) {
          edges.push(nw_edges[i]);
          break;
        }
      }
    }

    let modules_indices = (c, s) =>
        s.reduce((a, e) => {
          return e[Object.keys(e)[0]].indexOf(c) != -1
              ? a.concat(Object.keys(e)[0])
              : a;
        }, []);

    let all_edges = [];
    for (var i = 0; i < nw_edges.length; i++) {
      s_i = modules_indices(nw_edges[i][0], module_to_genes_arr);
      t_i = modules_indices(nw_edges[i][1], module_to_genes_arr);
      if (s_i.length != 0 || t_i.length != 0) all_edges.push(nw_edges[i]);
    }

    let all_nodes = all_edges.reduce((acc, cur1) => {
      return acc.concat(
          (cur1[0] == cur1[1] ? [cur1[0]] : cur1).filter(
              cur2 => acc.indexOf(cur2) == -1
          )
      );
    }, []);

    edges = edges.map(cur => {
      return {
        id: cur[1] + "_" + cur[0],
        target: cur[1],
        source: cur[0]
      };
    });
    all_edges = all_edges.map(cur => {
      return {
        id: cur[1] + "_" + cur[0],
        target: cur[1],
        source: cur[0]
      };
    });
    all_nodes = all_nodes.map(cur => {
      return { id: cur, eid: cur };
    });

    console.log(
        `number of edges: ${edges.length}\n` +
        `number of all_edges: ${all_edges.length}\n` +
        `number of all_nodes: ${all_nodes.length}\n`
    );

    return {
      nodes: nodes,
      edges: edges,
      all_nodes: all_nodes,
      all_edges: all_edges,
      modules: module_to_genes,
    };
  };

  const file_output_data = fs.readFileSync(userDirectory+"/modules/modules.out");

  const algOutput = dominoPostProcess(file_output_data, req.files["Network file contents"].data);
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