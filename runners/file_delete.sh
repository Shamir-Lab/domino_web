#!/bin/bash

file_to_delete_from=${1}

cd file_to_delete_from
find ./* -mmin +60 -type d \( ! -name "networks" \) | xargs -I {} rm -fr {}
find ./* -mmin +60 -name "*.zip" | xargs -I {} rm -fr {}
