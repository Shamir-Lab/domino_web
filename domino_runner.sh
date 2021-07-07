#!/bin/bash
set -e 

user_directory=${1}
active_genes_file_name=${2}
active_genes_file=${user_directory}/${active_genes_file_name}
network_file=${user_directory}/${3}
output_folder=${user_directory}/${4}
domino_python_env=${5}
ami_plugins_python_env=${6}

echo ${ami_plugins_python_env}
echo ${active_genes_file_name}

# activate virtual environment
source ${domino_python_env}/bin/activate

# run DOMINO preprocess and DOMINO
slicer --network_file ${network_file} --output_file ${network_file}".slicer" &&  domino  --active_genes_files ${active_genes_file} --network_file  ${network_file} --slices_file ${network_file}".slicer" --output_folder  ${output_folder} --visualization false &>/dev/null

# set the directory of the modules static html files
mv ${output_folder}/${active_genes_file_name%.*}/* ${output_folder}
rm -d ${output_folder}/${active_genes_file_name%.*}


deactivate
source ${ami_plugins_python_env}/bin/activate

# GO enrichment

mkdir ${user_directory}/go

go_enrichment --tested_genes ${user_directory}/modules/modules.out --background_genes ${network_file} --qval_th 0.05 --output_folder ${user_directory}/go

n_modules=$(wc -l ${user_directory}/modules/modules.out | cut -d ' '  -f 1)
n_modules=$(($n_modules-1))

# visualize modules 

for i in $(seq 0 $n_modules); 
do
	echo $i
        visualize_module --module_file_name ${user_directory}/go/module_genes_${i}.txt --active_genes_file_name ${active_genes_file} --network_file_name ${network_file} --go_file_name ${user_directory}/go/module_go_${i}.tsv --output_folder ${user_directory}/modules
done

