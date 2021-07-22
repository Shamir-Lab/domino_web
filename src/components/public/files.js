const fileStructure = {
    files: [
        {
            name: "Active gene file",
            type: ".txt",
            maxSize: 10, // in MB
            description: "The active gene set(s). To analyze a signle set, please provide a line-separated set of gene ids. For multiple set, please provide a tab-separated table of two columns: The first column in the gene id and the second column is the set identifier. Some examples can be found <a href='https://github.com/Shamir-Lab/DOMINO/tree/master/examples'>here</a>",
            tourStep: "first-step"
        },
        {
            name: "Network file",
            type: ".sif",
            maxSize: 10,
            tourStep: "second-step",
            description: "Graph edges in .sif format, where each pair genes should appear in a separate line. Some examples can be found <a href='https://github.com/Shamir-Lab/DOMINO/tree/master/examples'>here</a>",
            availableFiles: {
                directory: "./public/networks/", // with respect to server.js
                fileNames: ["dip.sif", "huri.sif", "string.sif"]
            }
        }
    ],
};

export default fileStructure;
