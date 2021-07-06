#!/bin/bash

cd public
find ./* -mmin +60 -type d | xargs -I {} rm -fr {}
find ./* -mmin +60 -name "*.zip" | xargs -I {} rm -fr {}
