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

function findInvalidNumber(): number {
  for (let i = preambleLength; i < input.length; i++) {
    const value = input[i];
    if (!isSumOf2Previous(value)) {
      return value;
    }

    previousNumbers.shift();
    previousNumbers.push(value);
  }
  throw new Error();
}

const invalidNumber = findInvalidNumber();
console.log('Not a sum of 2 previous numbers:', invalidNumber);

function findContiguousSetStartingAt(start: number): number | undefined {
  let index = start;
  let total = 0;
  let smallest = input[start];
  let largest = input[start];

  while (total < invalidNumber) {
    const cur = input[index];
    total += cur;
    index++;

    smallest = Math.min(smallest, cur);
    largest = Math.max(largest, cur);
  }

  if (total === invalidNumber) {
    return smallest + largest;
  }

  return undefined;
}

for (let i = 0; i < input.length; i++) {
  const weakness = findContiguousSetStartingAt(i);
  if (weakness) {
    console.log('Encryption weakness:', weakness);
    break;
  }
}
