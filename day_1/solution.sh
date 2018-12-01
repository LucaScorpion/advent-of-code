#!/bin/bash
set -euo pipefail

total=0

# Read all lines from the input, adding them to the total.
while IFS='' read -r line || [[ -n "$line" ]]
do
    let total+=line
done < 'input.txt'

echo $total
