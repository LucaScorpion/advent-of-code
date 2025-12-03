import * as fs from 'fs';

const banks = fs.readFileSync(0).toString().trim().split('\n')
  .map((l) => l.split('').map(Number));

function maxJoltage(bank: number[]): number {
  // Find the largest digit from the bank except the last number.
  const firstDigit = Math.max(...bank.slice(0, bank.length - 1));
  const firstDigitIndex = bank.indexOf(firstDigit);

  // Find the second digit from the part of the bank right of the first digit.
  const secondDigit = Math.max(...bank.slice(firstDigitIndex + 1));

  return Number(`${firstDigit}${secondDigit}`);
}

const totalJoltage = banks.reduce((acc, cur) => acc + maxJoltage(cur), 0);
console.log(`Total joltage: ${totalJoltage}`);
