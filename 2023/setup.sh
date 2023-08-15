#!/usr/bin/env bash
set -eu

dayDir="./day_$1"

if [ -d "$dayDir" ]
then
  echo 'Day already exists!'
  exit 1
fi

mkdir "$dayDir"
touch "$dayDir/input.txt"
touch "$dayDir/output.txt"

printf 'package main

import (
	"aoc2023/utils"
)

func main() {
\tlines := utils.ReadStdinLines()
}
' > "$dayDir/solution.go"
