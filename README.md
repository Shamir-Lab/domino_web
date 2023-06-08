# DOMINO webinized - Finding active modules has never been easier!

DOMINO as a web-based service is avaliable [here](http://domino.cs.tau.ac.il/).

The original standalone version of DOMINO is available [here](https://github.com/Shamir-Lab/DOMINO)

## Prerequisites:
1. node.js
2. mongoDB server
3. Dependency proejcts: [ami_plugins](https://github.com/Shamir-Lab/ami_plugins) and [DOMINO](https://github.com/Shamir-Lab/domino)

## Installation instructions:
To run a domino server perform the following steps:
1. Download and install Domino standalone tool from [here](https://github.com/Shamir-Lab/DOMINO)
2. Clone domino_web:
```
    git clone https://github.com/hag007/domino_web.git
    cd domino_web
```
3. Create a file named `config.js` and insert he following lines:
```
const conf_server = {
  IP_ADDRESS: "your DNS/server IP",
  DOMINO_PYTHON_ENV: "/path/to/domino-env",
  AMI_PLUGINS_PYTHON_ENV: "/path/to/AMI-PLUGINS/"
  DOMINO_PATH: "/path/to/DOMINO/"
  PORT: 1234

};

module.exports = { conf: conf_server };
```
4. Complete the setup process
```
    npm install     # Install dependencies
    npm run build   # Build the client side: Needs to be done each time client side files are modified
    node server.js     # run the server
```

## Run an analysis from a running website: 

### See instruction on [DOMINO website](http://domino.cs.tau.ac.il/)
