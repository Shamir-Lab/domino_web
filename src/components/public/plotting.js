export const gitClones = {
    total: 352,
    monthly: [
        ...([...Array(7).keys()].map((val) => ({

            date: `${val+1}/21`,
            freq: (1000 + 100 * val)
        }))),
    ]
};

export const DOMINOExecutions = {
    total: 83, // not necessarily the sum of freq's since those are sampled on a monthly basis
    monthly: [
        {
            date: "6/21",
            freq: 5000
        },
        {
            date: "7/21", // monthly samples at the end of every month
            freq: 8053
        }
    ]
};
