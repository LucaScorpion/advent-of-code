import fs from 'fs';

const [polymerTemplate, pairLines] = fs.readFileSync(0).toString().trim().split('\n\n');
const STEPS = 10;

const pairInsertions: Record<string, string> = Object.fromEntries(pairLines.split('\n').map((line) => line.split(' -> ')));

function processPolymer(p: string[]): string[] {
  const result: string[] = [];

  for (let i = 0; i < p.length - 1; i++) {
    result.push(p[i]);

    const insert = pairInsertions[`${p[i]}${p[i + 1]}`];
    if (insert) {
      result.push(insert);
    }
  }
  result.push(p[p.length - 1]);

  return result;
}

let polymer = polymerTemplate.split('');
for (let step = 0; step < STEPS; step++) {
  polymer = processPolymer(polymer);
}

const elementCounts: Record<string, number> = {};
polymer.forEach((elem) => {
  if (!elementCounts[elem]) {
    elementCounts[elem] = 0;
  }
  elementCounts[elem]++;
});

const mostCommon = Math.max(...Object.values(elementCounts));
const leastCommon = Math.min(...Object.values(elementCounts));

console.log(`Most common - least common = ${mostCommon - leastCommon}`);
