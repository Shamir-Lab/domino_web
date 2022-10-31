const fileStructure = {
    files: [
        {
            name: "Active gene file",
            type: ".txt",
            maxSize: 10, // in MB
            description: "The active gene set(s) (ENSEMBL ids or gene symbols; For preloaded networks, only human and mouse are supported). To analyze a single set, please provide a line-separated set of gene ids. For multiple sets, please provide a tab-separated table of two columns: The first column is the gene id and the second column is the set identifier. Some examples can be found <a href='https://github.com/hag007/domino_web/tree/fu_fixes/examples/active_gene_sets' target='_blank'>here</a>. To download an example file, go inside the file and then right-click on the \"raw\" button at the right and choose \"save link as...\"",
            tourStep: "first-step"
        },
        {
            name: "Network file",
            type: ".sif",
            maxSize: 10,
            tourStep: "second-step",
            description: "Graph edges in .sif format, where each pair of gene ids should appear in a separate line. Some examples can be found <a href='https://github.com/hag007/domino_web/tree/fu_fixes/examples/networks' target='_blank'>here</a>. To download an example file, go inside the file and then right-click on the \"raw\" button the at right and choose \"save link as...\"",
            availableFiles: {
                directory: "./public/networks/", // with respect to server.js
                fileMetadatas: [{name: "dip.sif", label: "DIP"}, {name: "huri.sif", label: "HuRI"}, {name: "string.sif", label : "STRING"}, {name: "pcnet.sif", label : "PCNet"}]
            }
        }
    ],
};

export default fileStructure;
