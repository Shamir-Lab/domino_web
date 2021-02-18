#!/bin/bash

active_genes_file=${1}
network_file=${2}
output_folder=${3}
python_env=${4}

source ${python_env}/bin/activate; slicer --network_file public/${network_file} --output_file public/${network_file}".slicer" &&  domino  --active_genes_files public/${active_genes_file} --network_file  public/${network_file} --slices_file public/${network_file}".slicer" --output_folder  ${output_folder} &>/dev/null
# echo "source ${python_env}/bin/activate; slicer --network_file public/${network_file} --output_file public/${network_file}".slicer" &&  domino  --active_genes_files public/${active_genes_file} --network_file  public/${network_file} --slices_file public/${network_file}".slicer" --output_folder  ${output_folder}"
# echo ${output_folder}/${active_genes_file%.*}/modules.out
cat ${output_folder}/${active_genes_file%.*}/modules.out
