const steps = [
    {
        selector: '[data-tour="first-step"]',
        content: 'Here you choose active gene set(s).\nyou can choose to analyze either a single set or multiple set.\nTo analyze a single set, please provide a line-separated set of gene ids. For multiple set, please provide a tab-separated table of two columns: The first column in the gene id and the second column is the set identifier.',
        position: "bottom"
    },
    {
        selector: '[data-tour="second-step"]',
        content: 'Here you choose a network file. You can either choose a pre-loaded network or provide a custom network file. custom network files should be in sif format, where each pair genes should appear in a separate line. For examples, see Shamir-Lab/DOMINO Github repository.',
        position: "bottom"
    },
    {
        selector: '[data-tour="third-step"]',
        content: 'Finally, hit execute and wait for the results! This process usually takes between 30 second and two minutes, dpending on  the input and the server load.',
        position: "left"
    },
];

export default steps;