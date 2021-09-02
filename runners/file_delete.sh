#!/bin/bash

cd public
find ./* -mmin +60 -type d \( ! -name "networks" \) | xargs -I {} rm -fr {}
find ./* -mmin +60 -name "*.zip" | xargs -I {} rm -fr {}
