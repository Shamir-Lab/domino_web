import sys, json, pandas as pd
from datetime import datetime

#csv_path, dest_path = sys.argv[1: 3]
csv_path = "test.csv"
dest_path = "src/components/public/freq.js"

df = pd.read_csv(
    csv_path,
    delimiter = ",",
    parse_dates=["time"]
    ).set_index("time")

network_file_usage = (
    df
    .query("network_file != ''")
    .groupby("network_file", as_index = False)
    .size()
    .to_frame()
    .reset_index()
    .rename(columns = {0: "freq"})
    )

frequency = (
    df
    .groupby(pd.Grouper(freq='M'))
    .size()
    .to_frame()
    .reset_index()
    .rename(columns = {0: "freq"})
    )

network_frequency = []
domino_frequency = {
    "monthly": [],
    "total": 0
}

for ind, d in network_file_usage.iterrows():
    network_frequency.append({
        "network": d["network_file"],
        "freq": d["freq"]
    })

for ind, d in frequency.iterrows():
    domino_frequency["monthly"].append({
        "time": str(d["time"])[:-9],
        "freq": d["freq"]
    })
    domino_frequency["total"] += d["freq"]

with open(dest_path, "w") as f:
    f.write(
          f"module.exports.networkFrequency = {network_frequency};\n"
        + f"module.exports.dominoFrequency = {domino_frequency};\n"
        + f"module.exports.lastAggregation = \"{datetime.now()}\";")


