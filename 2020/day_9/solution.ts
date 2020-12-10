import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map((line) => parseInt(line, 10));

const preambleLength = 25;
const previousNumbers = input.slice(0, preambleLength);

function isSumOf2Previous(value: number): boolean {
  for (let i = 0; i < previousNumbers.length - 1; i++) {
    for (let j = i + 1; j < previousNumbers.length; j++) {
      const iVal = previousNumbers[i];
      const jVal = previousNumbers[j];
      if (iVal !== jVal && value === iVal + jVal) {
        return true;
      }
    }
  }
  return false;
}

for (let i = preambleLength; i < input.length; i++) {
  const value = input[i]
  if (!isSumOf2Previous(value)) {
    console.log('Not a sum of 2 previous numbers:', value);
    break;
  }

  previousNumbers.shift();
  previousNumbers.push(value);
}
