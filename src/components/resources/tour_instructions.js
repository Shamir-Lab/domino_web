export const file_upload_steps = [
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

export const module_steps = [
    {
        selector: '[data-tour="first-step"]',
        content:
            "Through this navbar you can move between resulting modules. You can find each module under the active gene set from which it was generated.",
        position: "bottom",
    },
    {
        selector: '[data-tour="second-step"]',
        content:
            'This pane show details of the module chosen from the navbar. Here you can see the examine the module as a visulaized graph, see the genes of the module as list (bottom-left table) or overlaid on the network ("show labels on network" button) and GO enrichment analysis (bottom-right table)',
        position: "center",
    },
    {
        selector: '[data-tour="third-step"]',
        content:
            'If you wish to save this analysis, you can download it here. In addition to the modules\' HTML files (located under "module" folder), this functionality also provides GO enrichment analysis and the modules as tsv/txt files (under "go" folder).',
        position: "right",
    },
];