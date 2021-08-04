#!/bin/bash
set -e 

dominoRunDirectory=${1}
active_genes_file_name=${2}
active_genes_file_path=${3}
network_file_path=${4}
output_folder=${5}
domino_python_env=${6}
ami_plugins_python_env=${7}

echo "activate virtual environment for DOMINO"
source ${domino_python_env}/bin/activate

echo "run DOMINO"

domino  --active_genes_files "${active_genes_file_path}" --network_file  "${network_file_path}" --slices_file "${network_file_path}.slicer" --output_folder  "${output_folder}" --visualization false # &>/dev/null
deactivate

echo 'correct session directory structure (modules_{}.html)'
mv "${output_folder}/${active_genes_file_name%.*}"/* "${output_folder}"
rm -d "${output_folder}/${active_genes_file_name%.*}"

echo activate virtual environment for AMI plugins
source "${ami_plugins_python_env}/bin/activate"

echo GO enrichment
mkdir "${dominoRunDirectory}/go"

n_chars=$(wc -m "${output_folder}/modules.out" | cut -d ' '  -f 1)

if [[ $n_chars -eq 0 ]]; then
    exit
fi

go_enrichment --tested_genes "${output_folder}/modules.out" --background_genes "${network_file_path}" --qval_th 0.05 --output_folder "${dominoRunDirectory}/go"

n_modules=$(wc -l "${output_folder}/modules.out" | cut -d ' '  -f 1)
n_modules=$(($n_modules))
echo "num modules $n_modules"

echo visualize modules 

declare -a pids=();
for i in $(seq 0 $n_modules); 
do
    echo $i
    visualize_module --module_file_name "${dominoRunDirectory}/go/module_genes_${i}.txt" --active_genes_file_name "${active_genes_file_path}" --network_file_name "${network_file_path}" --go_file_name "${dominoRunDirectory}/go/module_go_${i}.tsv" --output_folder "${output_folder}" & pids+=($!)
done

echo "waiting for visualization to be completed..."
wait "${pids[@]}"
echo done!
