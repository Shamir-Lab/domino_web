export const DOMINOExecutions = {
    total: 10000,
    monthly: [
        ...([...Array(12).keys()].map((val) => ({

            date: `${val+1}/31/21`,
            freq: (1000 + 100 * val)
        }))),
    ]
};

export const gitClones = {
    total: 10000, // not necessarily the sum of freq's since those are sampled on a monthly basis
    monthly: [
        {
            date: "9/31/21",
            freq: 5000
        },
        {
            date: "10/31/21", // monthly samples at the end of every month
            freq: 8053
        }
    ]
};
