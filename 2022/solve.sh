#!/usr/bin/env bash

dayDir="./day_$1"
inputFile="$dayDir/input.txt"

npm start "$dayDir/solution."* < "$inputFile"
