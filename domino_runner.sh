#!/bin/bash

active_genes_file=${1}
network_file=${2}
output_folder=${3}
python_env=${4}

# activate virtual environment
source ${python_env}/bin/activate

# run DOMINO preprocess and DOMINO
slicer --network_file ${network_file} --output_file ${network_file}".slicer" &&  domino  --active_genes_files ${active_genes_file} --network_file  ${network_file} --slices_file ${network_file}".slicer" --output_folder  ${output_folder} &>/dev/null

# set the directory of the modules static html files
mv ${output_folder}/active_gene_files/* ${output_folder}
rm -d ${output_folder}/active_gene_files

# output the result to stdout
cat ${output_folder}/modules.out