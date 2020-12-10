import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map((line) => parseInt(line, 10))
  .sort((a, b) => a - b);

const builtinAdapterJoltage = input[input.length - 1] + 3;

const joltages = [0, ...input, builtinAdapterJoltage];
const differences: number[] = [];

for (let i = 1; i < joltages.length; i++) {
  differences.push(joltages[i] - joltages[i - 1]);
}

const d1Count = differences.filter((d) => d === 1).length;
const d3Count = differences.filter((d) => d === 3).length;

console.log(d1Count, '*', d3Count, '=', d1Count * d3Count);
