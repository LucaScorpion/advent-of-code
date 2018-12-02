#!/bin/bash
set -euo pipefail

javac -d out src/* && java -cp out Main
