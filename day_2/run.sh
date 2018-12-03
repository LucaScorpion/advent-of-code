#!/bin/bash
set -euo pipefail

dir=$(dirname $0)
outDir="$dir/out"
javac -d "$outDir" "$dir/src/"* && java -cp "$outDir" Main
