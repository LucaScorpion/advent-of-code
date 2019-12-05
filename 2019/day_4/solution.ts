import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split('-');
const from = parseInt(input[0], 10);
const to = parseInt(input[1], 10);

function checkV1(code: string): boolean {
  let dubs = false;
  let prevDigit = code[0];

  for (let i = 1; i < code.length; i++) {
    const currentDigit = code[i];

    if (prevDigit === currentDigit) {
      dubs = true;
    } else if (currentDigit < prevDigit) {
      return false;
    }

    prevDigit = currentDigit;
  }

  return dubs;
}

function checkV2(code: string): boolean {
  let dubs = false;
  let digitCounter = 1;
  let prevDigit = code[0];

  for (let i = 1; i < code.length; i++) {
    const currentDigit = code[i];

    if (prevDigit === currentDigit) {
      digitCounter++;
    } else if (currentDigit < prevDigit) {
      return false;
    } else {
      // currentDigit > prevDigit
      if (digitCounter === 2) {
        dubs = true;
      }
      digitCounter = 1;
    }

    prevDigit = currentDigit;
  }

  if (digitCounter === 2) {
    dubs = true;
  }

  return dubs;
}

let found1 = 0;
let found2 = 0;
for (let code = from; code <= to; code++) {
  const codeStr = code.toString();
  if (checkV1(codeStr)) {
    found1++;
  }
  if (checkV2(codeStr)) {
    found2++;
  }
}
console.log('Found', found1, 'possible codes with the first criteria');
console.log('Found', found2, 'possible codes with the second criteria');
