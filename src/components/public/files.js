const fileStructure = {
  files: [
    {
      name: "Active genes file",
      type: ".txt",
      maxSize: 5, // in MB
      description: "Marks activity scores of nodes.",
    },
    {
      name: "Network file",
      type: ".sif",
      maxSize: 5,
      description: "Edges that compose the graph.",
    }
  ],
};

export default fileStructure;
