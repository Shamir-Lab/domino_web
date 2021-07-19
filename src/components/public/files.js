const fileStructure = {
    files: [
        {
            name: "Active gene file",
            type: ".txt",
            maxSize: 5, // in MB
            description: "Marks activity scores of nodes.",
        },
        {
            name: "Network file",
            type: ".sif",
            maxSize: 5,
            description: "Edges that compose the graph.",
            availableFiles: {
                directory: "./public/networks/", // with respect to server.js
                fileNames: ["dip.sif", "huri.sif", "string.sif"]
            }
        }
    ],
};

export default fileStructure;
