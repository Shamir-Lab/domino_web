# DOMINO webinized - Finding active modules has never been easier!

DOMINO as a web-based service is avaliable [here](http://rack-shamir3.cs.tau.ac.il:8000/) (only via TAU VPN).

The original standalone version of DOMINO is available [here](https://github.com/Shamir-Lab/DOMINO)

## Installation instructions:
To run a domino server perform the following steps:
1. Download and install Domino standalone tool from [here](https://github.com/Shamir-Lab/DOMINO)
2. Clone domino_web:
```
    git clone https://github.com/hag007/domino_web.git
    cd domino_web
    npm install     # Install dependencies
    npm run start   # Build the client side: Needs to be done each time client side files are modified
    node server     # run the server
```

## Run an analysis from a running website: 

### To find active modules you need:
* Active gene file: tab-delimited A line-separated list of genes. 
* Network file: A tab-delimited sif formatted file. The file should have only two genes per row, where the first row is the header of the file.

In both files the gene identifiers are Ensembl ids. 

Njoy! :)
