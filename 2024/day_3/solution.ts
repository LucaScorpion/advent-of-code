import * as fs from 'fs';

const input = fs.readFileSync(0).toString().trim();

const mulPattern = /mul\(\d{1,3},\d{1,3}\)/g;
const matches = input.matchAll(mulPattern);

const mulResults = [...matches]
  .map((m) => m[0])
  .map((m) => {
    const left = parseInt(m.substring(m.indexOf('(') + 1, m.indexOf(',')), 10);
    const right = parseInt(m.substring(m.indexOf(',') + 1, m.indexOf(')')), 10);
    return left * right;
  });

const sumOfMuls = mulResults.reduce((acc, cur) => acc + cur, 0);
console.log(`Sum of mul operations: ${sumOfMuls}`);
