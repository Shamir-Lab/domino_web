const mongoose = require('mongoose');

/** Database setup */
// const uri = "mongodb+srv://nimsi:H9mEnJNgwLYeRqm6@cluster0.fj8em.mongodb.net/executions?retryWrites=true&w=majority";
// mongoose.set('bufferCommands', false); // temporary
const uri = 'mongodb://127.0.0.1/executions';
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Successful MongoDB connection."));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const executionSchema = new mongoose.Schema({
    date: Date,
    network: String
});
const Execution = mongoose.model("Execution", executionSchema);

const addExecution = async (network) => {
    return Execution.create({
        date: new Date(),
        network: network
    });
};

const aggregateExecutions = async () => {
    let totalExecutions = Execution.aggregate([
        {
            $group: {
                _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                count: { $sum: 1 },
            }
        }
    ]);

    let networkUsage = Execution.aggregate([
        {
            $group: {
                _id: "$network",
                freq: { $sum: 1 }
            }
        }
    ]);

    let monthlyUsageWithNetworks = Execution.aggregate([
        {
            $group: {
                _id: { year: { $year: "$date" }, month: { $month: "$date" }, network: "$network" },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: { year: "$_id.year", month: "$_id.month" },
                networks: {
                    $push: { network: "$_id.network", count: "$count" }
                }
            }
        }
    ]);

    return await Promise.all([totalExecutions, networkUsage, monthlyUsageWithNetworks]);
};

const createDummyValues = async () => {
    return Promise.all([...Array(5).keys()].map(_ => Execution.create({ date: new Date(), network: "dip.sif"})).concat(
        [...Array(10).keys()].map(_ => Execution.create({ date: `10/${_ + 1}/21`, network: "huri.sif"})),
        [...Array(15).keys()].map(_ => Execution.create({ date: `11/${_ + 1}/21`, network: "string.sif"}))
    ));
};

module.exports = {
    addExecution,
    aggregateExecutions,
    createDummyValues
};