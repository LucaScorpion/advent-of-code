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

printf 'import * as fs from '\''fs'\'';

const lines = fs.readFileSync(0).toString().trim().split('\''\\n'\'');
' > "$dayDir/solution.ts"
