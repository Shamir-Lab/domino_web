#!/bin/bash

cd public
find ./* -type d | xargs -I {} rm -fr {}
find ./* -name *.zip | xargs -I {} rm -fr {}
