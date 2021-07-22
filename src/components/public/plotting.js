export const DOMINOExecutions = {
    total: 10000, // not necessarily the sum of freq's since those are sampled on a weekly basis
    weekly: [
        ...([...Array(30).keys()].map((val) => ({

            date: `9/${val+1}/21`,
            freq: (1000 + 100 * val)
        }))),
    ]
};

export const gitClones = {
    total: 10000, // not necessarily the sum of freq's since those are sampled on a weekly basis
    weekly: [
        {
            date: "9/17/21",
            freq: 5000
        },
        {
            date: "9/24/21", // weekly increments
            freq: 8053
        }
    ]
};
