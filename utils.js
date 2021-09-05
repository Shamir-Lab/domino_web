const promisifyAll = require('util-promisifyall');
const util = require('util');
const fs = require("fs");

const conf = require("./config.js").conf;
const dictionaries = require("./dictionaries.js");
const readFile = util.promisify(fs.readFile);

const dominoPostProcess = (file_output_data, networkFileData) => {
    const py_output = new String(file_output_data);


    const modules_str = py_output.trim() === '' ? [] : py_output.split("\n");
    const module_to_genes={};
    let nodes=[];
    for (i=0;i<modules_str.length;i++){
        if (modules_str[i]===''){
            continue;
        }
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

    let nw = new String(networkFileData);
    let nw_edges = nw
    //console.log(`nw: ${nw}`)
        .trim()
        .split("\n")
        .map(cur => {
            let x = cur.split("\t");
            x.splice(1, 1);
            return x;
        });

    //console.log(`nw_edges: ${nw_edges}`)

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

    return {
        nodes: nodes,
        edges: edges,
        all_nodes: all_nodes,
        all_edges: all_edges,
        modules: module_to_genes,
    };
};

const separateActiveGenes = (fileString) => {
    /** Partitions active genes into sets of genes.
     * Returns an object {setID: list of genes}.
     * In the case that the file has one column, as opposed to two,
     * return an object with a single key:value pair.
     */
    fileString = fileString.replace("/\r\n/g","\n")
    const lines = fileString.split("\n");
    const activeGenesSet = {};

    if (lines[0].split("\t").length === 1) {
        const genericSetName = "DefaultSet";
        activeGenesSet[genericSetName] = lines;
    } else {
        lines.map(line => {
            if (line.trim()==='') {
                return;
            }
            line=line.trim();
            const fields = line.split("\t");
            const [gene, setID] = fields;
            if (activeGenesSet[[setID]] === undefined) {
                activeGenesSet[[setID]] = [];
            }
            activeGenesSet[[setID]].push(gene);
        })
    }    
    return activeGenesSet;
};

const convert2Ensg = (activeGenesSet) => {

    Object.keys(activeGenesSet).forEach(item => {
        activeGenesSet[item] = [...new Set(activeGenesSet[item].map(element => convertEnsemblIdentifier2Ensg(element)).filter(element => !!element))];
    }); 
  
   return activeGenesSet
};

const convertEnsemblIdentifier2Ensg = (ensemblIdentifier) => {
   
    if (ensemblIdentifier.startsWith("ENSG")){
        return ensemblIdentifier;
    }
    for (let i=0; i<dicts.length; i++){
        convertedValue=dicts[i][ensemblIdentifier]
        if(convertedValue){
            return convertedValue;
        }
    }
};

const loadEnsemblDictionaries = async () => {
     
    dictPromises= dictionaries.map(async element => {
        const elem=await readFile(element);
        const dictContent = new String(elem).replace("/\r\n","\n").split("\n"); 
        dict={}
        for (let i=0; i<dictContent.length;i++){
            dictEntry=dictContent[i].split("\t");
            if (dictEntry.length !=2){
                continue           
            }
 
            dict[dictEntry[0]]=dictEntry[1];
        }
        return dict; 
    });

    Promise.all(dictPromises).then((results) =>{ 
        dicts=results; 
    }).catch((err)=>{
        console.log(err); 
    });
    
};
const draftSessionDirectoryDetails = (userFileNames) => {
    /** Returns the directory path and directory name for this one user's domino web execution session. */

    let strip_extension = (str) => {
        /* Returns the string's base name before any ".txt" or ".sif" extension. */
        return str.slice(0, str.indexOf("."));
    };

    let timestamp = (new Date()).getTime();
    let customFile = [
        ...Object.values(userFileNames).map(userFileName => strip_extension(userFileName)),
        timestamp
    ].join("@");

    return [`${__dirname}/public/${customFile}`, customFile];
};

const hasNonAlphaNumericChars = (str) => {
    return ! /^[a-z0-9\s-_]+$/i.test(str);
};

const hasExpectedFileExtension = (fileName, extension) => {
    return fileName.split('.').pop()===extension;
};


let dicts;

loadEnsemblDictionaries();

const formatDate = (t) => {
    /** Returns a date formatted in the form %m/%d/%y. */
    let a = [{month: 'numeric'}, {day: 'numeric'}, {year: 'numeric'}];
    return a.map((m) => {
        let f = new Intl.DateTimeFormat('en', m);
        return f.format(t);
    }).join("/");
}

module.exports = {
    dominoPostProcess,
    separateActiveGenes,
    draftSessionDirectoryDetails,
    hasNonAlphaNumericChars,
    hasExpectedFileExtension,
    convert2Ensg,
    formatDate
};
