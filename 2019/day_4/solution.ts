import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split('-');
const from = parseInt(input[0], 10);
const to = parseInt(input[1], 10);

function check(code: number): boolean {
  const codeStr = code.toString();
  let dubs = false;

  // Use a string here, we can simply compare ASCII codes to check which number is higher, no need to re-parse.
  let prevDigit = '0';
  for (let i = 0; i < codeStr.length; i++) {
    const currentDigit = codeStr[i];

    if (prevDigit === currentDigit) {
      dubs = true;
    } else if (currentDigit < prevDigit) {
      return false;
    }

    prevDigit = currentDigit;
  }

  return dubs;
}

let found = 0;
for (let code = from; code <= to; code++) {
  if (check(code)) {
    found++;
  }
}
console.log('Found', found, 'possible codes');
