import fs from 'fs';

const [polymerTemplate, pairLines] = fs.readFileSync(0).toString().trim().split('\n\n');
const STEPS_1 = 10;
const STEPS_2 = 40;

const pairInsertions: Record<string, string> = Object.fromEntries(pairLines.split('\n').map((line) => line.split(' -> ')));
let pairs: Record<string, number> = {};

for (let i = 0; i < polymerTemplate.length - 1; i++) {
  const pairString = `${polymerTemplate[i]}${polymerTemplate[i + 1]}`;
  pairs[pairString] = (pairs[pairString] || 0) + 1;
}

function processPolymer(old: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {};

  Object.entries(old).forEach(([pair, count]) => {
    let newPairLeft = pair;

    if (pairInsertions[pair]) {
      newPairLeft = `${pair[0]}${pairInsertions[pair]}`;

      const newPairRight = `${pairInsertions[pair]}${pair[1]}`;
      result[newPairRight] = (result[newPairRight] || 0) + count;
    }

    result[newPairLeft] = (result[newPairLeft] || 0) + count;
  });

  return result;
}

function printResult(steps: number): void {
  const elementCounts: Record<string, number> = {};
  Object.entries(pairs).forEach(([pair, count]) => {
    const elem = pair[0];
    elementCounts[elem] = (elementCounts[elem] || 0) + count;
  });
  const lastElem = polymerTemplate[polymerTemplate.length - 1];
  elementCounts[lastElem] = (elementCounts[lastElem] || 0) + 1;

  const mostCommon = Math.max(...Object.values(elementCounts));
  const leastCommon = Math.min(...Object.values(elementCounts));

  console.log(`Most common - least common after ${steps} steps = ${mostCommon - leastCommon}`);
}

for (let step = 0; step < STEPS_2; step++) {
  pairs = processPolymer(pairs);

  if (step === STEPS_1 - 1) {
    printResult(STEPS_1);
  }
}
printResult(STEPS_2);
