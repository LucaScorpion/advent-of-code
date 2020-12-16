import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)[0]
  .split(',').map((s) => parseInt(s, 10));

let turn = input.length - 1;
let currentNumber = input[input.length - 1];
const pastNumbers: Record<number, number> = {};

for (let i = 0; i < input.length - 1; i++) {
  pastNumbers[input[i]] = i;
}

function step(): void {
  const lastOccurrence = pastNumbers[currentNumber];
  const newNumber = lastOccurrence === undefined ? 0 : turn - lastOccurrence;

  pastNumbers[currentNumber] = turn;
  currentNumber = newNumber;
  turn++;
}

while(turn < 2019) {
  step();
}
console.log(currentNumber);
