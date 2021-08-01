const steps = [
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

export default steps;