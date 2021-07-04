#!/bin/bash
 
find ./public/* -type d -mmin +60 -exec rm -rf {} \;
