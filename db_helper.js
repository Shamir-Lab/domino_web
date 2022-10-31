const mongoose = require("mongoose");

/** Database setup */
const uri = "mongodb://127.0.0.1/executions";
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successful MongoDB connection."));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

/** Define database structure. */
const executionSchema = new mongoose.Schema({
    date: Date,
    network_name: String,
    network_group: String,
}, {collection : 'executions'});
const Execution = mongoose.model("Execution", executionSchema);

const gitSchema = new mongoose.Schema({
    date: Date,
    traffic: Number,
    clones: Number,
}, {collection : 'git'});
const Git = mongoose.model("Git", gitSchema);

const biocondaSchema = new mongoose.Schema({
    date: Date,
    downloads: Number,
    pkg_name: String,
}, {collection : 'bioconda'});
const Bioconda = mongoose.model("Bioconda", biocondaSchema);

const pypiSchema = new mongoose.Schema({
    date: Date,
    downloads: Number,
    pkg_name: String,
}, {collection : 'pypi'});
const Pypi = mongoose.model("Pypi", pypiSchema);


/** Define public functions */
const addExecution = async (network, is_custom) => {
    console.log(is_custom)
    return Execution.create({
        date: new Date(),
        network_group: is_custom ? "Loaded by user" :network,
        network_name: network
    });
};


const aggregateBioconda = async () => {

    // console.log(Git.count())
    
    let yearlyBioconda = Bioconda.aggregate([
        {$match: { date: { $gte: new Date(new Date().getYear(), 1, 1) }, pkg_name: "domino" }},
        {$group: {_id : null, downloads: { $sum: "$downloads" }}}, {$project: {_id: 0 , downloads : "$downloads"}}]);

    let monthlyBioconda = Bioconda.aggregate([
        {
            $match  : {
                pkg_name: "domino" 
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                downloads: { $sum: "$downloads" }
            }
        }
    ]);


    return await Promise.all([
        yearlyBioconda,
        monthlyBioconda,
    ]);
};

const aggregatePypi = async () => {

    // console.log(Git.count())
    
    let yearlyPypi = Pypi.aggregate([
        {$match: { date: { $gte: new Date(new Date().getYear(), 1, 1) }, pkg_name: "domino-python" }},
        {$group: {_id : null, downloads: { $sum: "$downloads" }}}, {$project: {_id: 0 , downloads : "$downloads"}}]);

    let monthlyPypi = Pypi.aggregate([
        {
            $match  : {
                pkg_name: "domino-python" 
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                downloads: { $sum: "$downloads" }
            }
        }
    ]);


    return await Promise.all([
        yearlyPypi,
        monthlyPypi,
    ]);
};





const aggregateGit = async () => {

    // console.log(Git.count())
    
    let yearlyGit = Git.aggregate([
        {$match: { date: { $gte: new Date(new Date().getYear(), 1, 1) },repository: "DOMINO" }},
        {$group: {_id : null, traffic: { $sum: "$traffic" }, clones: { $sum: "$clones" }}}, {$project: {_id: 0 , traffic : "$traffic", clones : "$clones"}}]);

    let monthlyGit = Git.aggregate([
        {
            $match  : {
                repository: "DOMINO" 
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                traffic: { $sum: "$traffic" },
                clones: { $sum: "$clones" }
            }
        }
    ]);


    return await Promise.all([
        yearlyGit,
        monthlyGit,
    ]);
};



const aggregateExecutions = async () => {
    // console.log(JSON.stringify([
    //     {
    //         $match  : { date: 
    //             { $gte: new Date(new Date().getFullYear(), 1, 1) } 
    //         }
    //     },
    //     {
    //         $count: "total",
    //     },
    // ]));
    let totalExecutions = Execution.aggregate([
        {
            $match  : { date: 
                { $gte: new Date(new Date().getYear(), 1, 1) } 
            }
        },
        {
            $count: "total",
        },
    ]);

    let networkExecutions = Execution.aggregate([
       {
            $group: {
                _id: "$network_group",
                freq: { $sum: 1 },
            },
       }
    ]);

    let monthlyExecutionsByNetworks = Execution.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    network: "$network_group",
                },
                count: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: { year: "$_id.year", month: "$_id.month" },
                networks: { $push: { k: "$_id.network", v: "$count" } },
            },
        },
        { $addFields: { networks: { $arrayToObject: "$networks" } } },
        {
            $replaceRoot: {
                newRoot: { $mergeObjects: [{ _id: "$_id" }, "$networks"] },
            },
        },
    ]);

    return await Promise.all([
        totalExecutions,
        networkExecutions,
        monthlyExecutionsByNetworks,
    ]);
};

const createDummyValues = async () => {
    return Promise.all(
        [...Array(5).keys()]
            .map((_) =>
                Execution.create({ date: new Date(), network: "dip.sif" })
            )
            .concat(
                [...Array(10).keys()].map((_) =>
                    Execution.create({
                        date: `10/${_ + 1}/21`,
                        network: "huri.sif",
                    })
                ),
                [...Array(15).keys()].map((_) =>
                    Execution.create({
                        date: `11/${_ + 1}/21`,
                        network: "string.sif",
                    })
                )
            )
    );
};

module.exports = {
    addExecution,
    aggregateExecutions,
    aggregateGit,
    aggregateBioconda,
    aggregatePypi,
    createDummyValues,
};
