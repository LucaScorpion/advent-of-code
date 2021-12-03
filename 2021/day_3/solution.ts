import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function binaryToDecimal(binary: number[] | string): number {
  const binaryString = typeof binary === 'string' ? binary : binary.join('');
  return parseInt(binaryString, 2);
}

function mostCommonBit(raw: string[], index: number, tieBreaker: number): number {
  return clamp01(
    raw
      .map((l) => l[index])
      .reduce((acc, cur) => acc + (cur === '1' ? 1 : -1), tieBreaker),
  );
}

function invertBit(bit: number): number {
  return bit === 1 ? 0 : 1;
}

const bitLength = lines[0].length;
const mostCommonBits: number[] = [];

for (let i = 0; i < bitLength; i++) {
  mostCommonBits[i] = mostCommonBit(lines, i, 1);
}

const leastCommonBits = mostCommonBits.map(invertBit);

const gammaRate = binaryToDecimal(mostCommonBits);
const epsilonRate = binaryToDecimal(leastCommonBits);
const powerConsumption = gammaRate * epsilonRate;

console.log(`Gamma: ${gammaRate}, epsilon: ${epsilonRate}, power consumption: ${powerConsumption}`);

let oxygenRatings = [...lines];
for (let i = 0; i < bitLength && oxygenRatings.length > 1; i++) {
  const b = mostCommonBit(oxygenRatings, i, 1);
  oxygenRatings = oxygenRatings.filter((l) => l[i] === b.toString());
}

const oxygenRating = binaryToDecimal(oxygenRatings[0]);
console.log(`Oxygen generator rating: ${oxygenRating}`);

let co2Ratings = [...lines];
for (let i = 0; i < bitLength && co2Ratings.length > 1; i++) {
  const b = invertBit(mostCommonBit(co2Ratings, i, 1));
  co2Ratings = co2Ratings.filter((l) => l[i] === b.toString());
}

const co2Rating = binaryToDecimal(co2Ratings[0]);
console.log(`CO2 scrubber rating: ${co2Rating}`);

console.log(`Life support rating: ${oxygenRating * co2Rating}`);
