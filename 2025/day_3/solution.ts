import * as fs from 'fs';

const banks = fs.readFileSync(0).toString().trim().split('\n')
  .map((l) => l.split('').map(Number));

function maxJoltage(bank: number[], amount: number): number {
  // Find the largest digit from the bank except any of the n-th last numbers.
  const digit = Math.max(...bank.slice(0, bank.length - (amount - 1)));
  const digitIndex = bank.indexOf(digit);

  if (amount === 1) {
    return digit;
  }

  const subJoltage = maxJoltage(bank.slice(digitIndex + 1), amount - 1);
  return Number(`${digit}${subJoltage}`);
}

console.log(`Total joltage for 2 batteries: ${banks.reduce((acc, cur) => acc + maxJoltage(cur, 2), 0)}`);
console.log(`Total joltage for 12 batteries: ${banks.reduce((acc, cur) => acc + maxJoltage(cur, 12), 0)}`);
