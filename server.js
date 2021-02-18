const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { exec } = require("child_process");
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

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "http://" + "localhost"+ ":8000"
  );
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
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

let modules_indices = (c, s) =>
  s.reduce((a, e) => {
    return e[Object.keys(e)[0]].indexOf(c) != -1
      ? a.concat(Object.keys(e)[0])
      : a;
  }, []);

app.post("/upload", timeout("10m"), (req, res, next) => {
  console.log(req.body)
  console.log("start.. " + req.body["algo"]);
  promises = [];
  let file_types = ["active_genes", "network"];
  try {
    let zipped = file_types.map(cur => [
      req.body[cur + "_file_name"],
      req.files[cur + "_file_content"]
    ]);

    zipped.map(files => {
      let p = new Promise((resolve, reject) => {
        if (files[0] != "") {
          console.log("about to start moving " + files[0]);
          files[1].mv(`${__dirname}/public/${files[0]}`, function(err) {
            console.log("got cb");
            if (err) {
              console.log("error while moving file: \n" + err);
              resolve();
              res.status(err.status || 500);
              res.render("error");
              return;
            } else {
              console.log("resolved " + files[0]);
              resolve(files[0]);
            }
          });
        } else {
          resolve("");
        }
      });
      promises.push(p);
    });
  } catch (e) {
    res.status(e.status || 500);
    res.statusMessage = e;
    console.log(res.statusMessage)
    res.render("error");
    return;
  }
  Promise.all(promises).then(values => {
    console.log("about to start py execution");
    exec(
      "bash domino_runner.sh "+req.body["active_genes_file_name"]+"  "+req.body["network_file_name"]+"  "+"public"+" "+conf.PYTHON_ENV,
      { cwd: conf.BASE_FOLDER },
      (err, stdout, stderr) => {
        console.log(stdout)
        if (err) {
          console.log(err);
          res.status(err.status || 500);
          res.render("error");
          res.end();
          return;
        }
          py_output = new String(stdout);
          output_folder = "/media/hag007/Data/repos/DOMINO/output/"+req.body["active_genes_file_name"].split('.').slice(0, -1).join('.'); // py_output.split("\n")[0].trim();
          let relative_output_dir = "";
          modules_str = py_output.split("\n");
          module_to_genes={}
          nodes=[]
          for (i=0;i<modules_str.length;i++){
            cur_module=modules_str[i].substring(1,modules_str[i].length-2).split(", ");
            module_to_genes[i] = cur_module
            nodes=nodes.concat(cur_module)
          }
          let module_to_genes_arr = [];
          let nodes_ids = []
          for (module in module_to_genes) {
            module_to_genes_arr.push({ [module]: module_to_genes[module] });
            nodes_ids.concat(module_to_genes[module])
          }
          // nodes_ids = module_to_genes_arr.reduce((x, y) => {
          //   x.concat(y);}, []);

          let nw = new String(req.files["network_file_content"].data);
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
          console.log("number of edges: " + edges.length);

          let all_edges = [];
          for (var i = 0; i < nw_edges.length; i++) {
            s_i = modules_indices(nw_edges[i][0], module_to_genes_arr);
            t_i = modules_indices(nw_edges[i][1], module_to_genes_arr);
            if (s_i.length != 0 || t_i.length != 0) all_edges.push(nw_edges[i]);
          }

          console.log("number of all_edges: " + all_edges.length);

          let all_nodes = all_edges.reduce((acc, cur1) => {
            return acc.concat(
              (cur1[0] == cur1[1] ? [cur1[0]] : cur1).filter(
                cur2 => acc.indexOf(cur2) == -1
              )
            );
          }, []);

          console.log("number of all_nodes: ", all_nodes.length);

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
          // console.log(module_to_genes)
          res.json({
            files_names: values.filter(x => x.length > 0),
            nodes: nodes,
            edges: edges,
            active_gene_file_name: req.body["active_genes_file_name"],
            network_file_name: req.body["network_file_name"],
            modules: module_to_genes,
            all_nodes: all_nodes,
            all_edges: all_edges,
            report_link: !!relative_output_dir
              ? conf.IP_ADDRESS +
                ":8000/" +
                relative_output_dir +
                "/all_modules.html" //graph_all_modules
              : ""
          });
          res.end();
        });
      }
    );
});

app.post("/getHTML", timeout("10m"), (req, res, next) => {
  console.log(req.body["filename"]);
  fs.readFile("public/"+req.body["filename"], function(err, data) {
    inner_html=new String(data);
    res.json({ inner_html: inner_html});
    res.end();
  });
});


app.listen(process.env.PORT || 8000);




