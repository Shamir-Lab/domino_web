const dominoPostProcess = (file_output_data, networkFileData) => {
    const py_output = new String(file_output_data);

    /*
    if (py_output.trim() === '') {
        return ...;
    }*/

    const modules_str = py_output.trim() === '' ? [] : py_output.split("\n");
    const module_to_genes={};
    let nodes=[];
    console.log(modules_str)
    for (i=0;i<modules_str.length;i++){
        cur_module=modules_str[i].substring(1,modules_str[i].length-2).split(", ");
        console.log(cur_module)
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
    const lines = fileString.split("\r\n");
    const activeGenesSet = {};

    if (lines[0].split("\t").length === 1) {
        const genericSetName = "DefaultSet";
        activeGenesSet[genericSetName] = lines;
    } else {
        lines.map(line => {
            if (line.trim()==='') {
                return;
            }
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

module.exports = {
    dominoPostProcess,
    separateActiveGenes,
    draftSessionDirectoryDetails,
    hasNonAlphaNumericChars,
    hasExpectedFileExtension
};
