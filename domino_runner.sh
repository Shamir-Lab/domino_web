#!/bin/bash

user_directory=${1}
active_genes_file_name=${2}
active_genes_file=user_directory/active_genes_file_name
network_file=user_directory/${3}
output_folder=${4}
python_env=${5}

# activate virtual environment
source ${python_env}/bin/activate

# run DOMINO preprocess and DOMINO
slicer --network_file ${network_file} --output_file ${network_file}".slicer" &&  domino  --active_genes_files ${active_genes_file} --network_file  ${network_file} --slices_file ${network_file}".slicer" --output_folder  ${output_folder} &>/dev/null

# set the directory of the modules static html files
mv ${output_folder}/${active_genes_file_name}/* ${output_folder}
rm -d ${output_folder}/${active_genes_file_name}

# output the result to stdout
cat ${output_folder}/modules.out