#!/bin/bash
set -euo pipefail

dayDir="./day_$1"
inputFile="$dayDir/input.txt"

# Find and execute a solution script.
for solution in "$dayDir/solution."*
do
    if [ -x "$solution" ]
    then
        "$solution" < "$inputFile"
    fi
done
