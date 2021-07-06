const conf_local = {
  IP_ADDRESS: "localhost",
  PYTHON_ENV: "/media/hag007/Data/repos/DOMINO/domino-env",
  DOMINO_PATH: "/media/hag007/Data/repos/DOMINO"
};

const conf_server = {
  IP_ADDRESS: "rack-shamir3.cs.tau.ac.il",
  DOMINO_PYTHON_ENV: "/specific/netapp5/gaga/hagailevi/domino4web-env",
  AMI_PLUGINS_PYTHON_ENV: "/specific/netapp5/gaga/hagailevi/ami_plugins-env",
  DOMINO_PATH: "/specific/netapp5/gaga/hagailevi/domino4web"

};

module.exports = { conf: conf_server };
