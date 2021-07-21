const fileStructure = {
    files: [
        {
            name: "Active gene file",
            type: ".txt",
            maxSize: 10, // in MB
            description: "Marks activity scores of nodes.",
            tourStep: "first-step"
        },
        {
            name: "Network file",
            type: ".sif",
            maxSize: 10,
            tourStep: "second-step",
            description: "Edges that compose the graph.",
            availableFiles: {
                directory: "./public/networks/", // with respect to server.js
                fileNames: ["dip.sif", "huri.sif", "string.sif"]
            }
        }
    ],
};

export default fileStructure;
