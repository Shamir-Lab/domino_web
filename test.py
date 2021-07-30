import csv, random

with open("test.csv", "w") as f:

    writer = csv.DictWriter(f, fieldnames = ["time", "network_file"])
    writer.writeheader()

    network_files = ["dip.sif", "huri.sif", "string.sif"]

    for m in range(1, 13):
        for d in range(1, 29):
            writer.writerow(
                {
                    "time": f"{m}/{d}/21",
                    "network_file": random.choice(network_files)
                }
            )