#!/bin/bash
set -euo pipefail

dayDir="./day_$1"
inputFile="$dayDir/input.txt"

npm start "$dayDir/solution."* < "$inputFile"
