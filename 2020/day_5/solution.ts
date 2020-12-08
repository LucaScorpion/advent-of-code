import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);

const maxRow = 127;
const maxCol = 7;

function findSpace(encoded: string, lower: number, upper: number): number {
  const split = lower + Math.round((upper - lower) / 2);
  const move = encoded.charAt(0);

  let newLower = lower;
  let newUpper = upper;

  if (move === 'F' || move === 'L') {
    newUpper = split - 1;
  } else {
    newLower = split;
  }

  const encRemainder = encoded.substring(1);
  if (encRemainder) {
    return findSpace(encRemainder, newLower, newUpper);
  }

  return (move === 'F' || move === 'L') ? lower : upper;
}

function getSeatId(row: number, column: number): number {
  return row * 8 + column;
}

const seatIds = input.map((line) => {
  const rowEnc = line.substring(0, 7);
  const colEnc = line.substring(7);

  const row = findSpace(rowEnc, 0, maxRow);
  const column = findSpace(colEnc, 0, maxCol);

  return getSeatId(row, column);
}).sort((a, b) => a - b);


const maxSeatId = seatIds[seatIds.length - 1];
console.log('Highest seat ID:', maxSeatId);

for (let i = 0; i < seatIds.length - 1; i++) {
  const thisSeatId = seatIds[i];
  const nextSeatId = seatIds[i + 1];
  if  (nextSeatId - thisSeatId > 1) {
    console.log('My seat ID:', thisSeatId + 1);
    break;
  }
}
