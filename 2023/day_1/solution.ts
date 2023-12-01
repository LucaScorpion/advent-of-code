import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().split('\n');

const numberWords = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

const numbers: number[] = [];
const numbersWithWords: number[] = [];

lines.forEach((l) => {
  const matches = l.match(/\d/g);
  if (matches) {
    numbers.push(parseInt(`${matches[0]}${matches[matches.length - 1]}`));
  }

  for (const w of numberWords) {
    l = l.replaceAll(w, `${w}${numberWords.indexOf(w) + 1}${w}`);
  }

  const wordMatches = l.match(/\d/g);
  if (wordMatches) {
    numbersWithWords.push(parseInt(`${wordMatches[0]}${wordMatches[wordMatches.length - 1]}`));
  }
});

const sum = numbers.reduce((acc, cur) => acc + cur, 0);
console.log(`Only numbers: ${sum}`);

const sumWithWords = numbersWithWords.reduce((acc, cur) => acc + cur, 0);
console.log(`Numbers and words: ${sumWithWords}`);
