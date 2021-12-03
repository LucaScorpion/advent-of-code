import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function binaryToDecimal(binary: number[]): number {
  return parseInt(binary.join(''), 2);
}

const bitLength = lines[0].length;
const mostCommonBits: number[] = [];

for (let i = 0; i < bitLength; i++) {
  mostCommonBits[i] = clamp01(
    lines
      .map((l) => l[i])
      .reduce((acc, cur) => acc + (cur === '1' ? 1 : -1), 0),
  );
}

const leastCommonBits = mostCommonBits.map((b) => b === 1 ? 0 : 1);

const gammaRate = binaryToDecimal(mostCommonBits);
const epsilonRate = binaryToDecimal(leastCommonBits);
const powerConsumption = gammaRate * epsilonRate;

console.log(`Gamma: ${gammaRate}, epsilon: ${epsilonRate}, power consumption: ${powerConsumption}`);
