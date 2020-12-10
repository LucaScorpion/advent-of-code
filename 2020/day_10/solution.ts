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

function countArrangements(arrangement: number[], upperI: number): number {
  let total = 0;

  for (let i = upperI; i > 0; i--) {
    const removed = [
      ...arrangement.slice(0, i),
      ...arrangement.slice(i + 1, arrangement.length),
    ];

    const lowVal = removed[i - 1];
    const highVal = removed[i];
    if (highVal - lowVal <= 3) {
      total += 1 + countArrangements(removed, i - 1);
    }
  }

  return total;
}


console.log('Valid arrangements:', countArrangements(joltages, joltages.length - 2) + 1);


// NAIVE IMPLEMENTATION, DOES NOT REALLY WORK
// Also add +1 to result.
function countArrangementsRecursive(startIndex: number): number {
  if (startIndex % 10 === 0) {
    console.log(startIndex);
  }

  if (startIndex === joltages.length - 1) {
    return 0;
  }

  const sourceJoltage = joltages[startIndex];
  let paths = -1;

  for (let i = startIndex + 1; i < startIndex + 4 && i < joltages.length; i++) {
    const adapterJoltage = joltages[i];
    if (adapterJoltage - sourceJoltage <= 3) {
      paths += 1 + countArrangementsRecursive(i);
    }
  }

  return paths;
}

