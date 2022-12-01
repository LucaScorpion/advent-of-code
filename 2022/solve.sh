#!/usr/bin/env bash

dayDir="./day_$1"
inputFile="$dayDir/input.txt"

if [ -f "$dayDir/solution.ts" ]
then
  npm start "$dayDir/solution.ts" < "$inputFile"
fi

if [ -f "$dayDir/solution.go" ]
then
  go run "$dayDir/solution.go" < "$inputFile"
fi
