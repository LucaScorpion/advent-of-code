#!/bin/bash
set -euo pipefail

dayDir="./day_$1"
runScript="$dayDir/run.sh"
inputFile="$dayDir/input.txt"

"$runScript" < "$inputFile"
