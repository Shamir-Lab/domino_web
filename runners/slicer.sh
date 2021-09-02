#!/bin/bash

network_file_path=${1}
sliced_file_path=${2}
domino_python_env=${3}

if [[ -f ${sliced_file_path} ]]
then
  echo "using cached files"
else
  echo "executing slicer"
  echo "activate virtual environment for slicer"
  source ${domino_python_env}/bin/activate
  slicer --network_file ${network_file_path} --output_file ${sliced_file_path}
  deactivate
fi