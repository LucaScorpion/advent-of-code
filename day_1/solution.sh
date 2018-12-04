#!/bin/bash
set -euo pipefail

input=()
frequency=0

# Frequency calibration.
declare -A frequencies
frequencies['0']=1
calibrated=false
iterations=0

function checkFrequencies
{
    # Add one to the frequency counter.
    local count=${frequencies["$frequency"]-0}
    let count+=1
    frequencies["$frequency"]=$count

    # Check if we are calibrated.
    if [ $count = 2 ]
    then
        calibrated=true
        echo "Calibrated frequency: $frequency"
    fi
}

function processInput
{
    for change in ${input[*]}
    do
        let frequency+=$change
        checkFrequencies

        # If we are calibrated, stop processing.
        if [ $calibrated = true ]
        then
            return
        fi
    done
}

# Read the complete input.
while IFS='' read -r line || [[ -n "$line" ]]
do
    input[${#input[*]}]=$line
done

# Process the input once, display the resulting frequency.
processInput
echo "Resulting frequency: $frequency"

# Continue calibration.
while [ $calibrated = false ]
do
    let iterations+=1
    processInput
done

echo "Calibration took $iterations additional iterations."
