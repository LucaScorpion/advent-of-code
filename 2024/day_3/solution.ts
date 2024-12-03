import * as fs from 'fs';

const input = fs.readFileSync(0).toString().trim();

const pattern = /(mul\(\d{1,3},\d{1,3}\))|(do(n't)?\(\))/g;
const matches = [...input.matchAll(pattern)].map((m) => m[0]);

const allMulResults = matches
  .map((m) => {
    if (m === 'do()' || m === 'don\'t()') {
      return 0;
    }

    const left = parseInt(m.substring(m.indexOf('(') + 1, m.indexOf(',')), 10);
    const right = parseInt(m.substring(m.indexOf(',') + 1, m.indexOf(')')), 10);
    return left * right;
  });

const allMuls = allMulResults.reduce((acc, cur) => acc + cur, 0);
console.log(`Sum of all mul operations: ${allMuls}`);

let enabled = true;
const conditionalMulResults = matches
  .map((m) => {
    if (m === 'do()') {
      enabled = true;
      return 0;
    }

    if (m === 'don\'t()') {
      enabled = false;
      return 0;
    }

    if (!enabled) {
      return 0;
    }

    const left = parseInt(m.substring(m.indexOf('(') + 1, m.indexOf(',')), 10);
    const right = parseInt(m.substring(m.indexOf(',') + 1, m.indexOf(')')), 10);
    return left * right;
  });

const conditionalMuls = conditionalMulResults.reduce((acc, cur) => acc + cur, 0);
console.log(`Sum of conditional mul operations: ${conditionalMuls}`);
