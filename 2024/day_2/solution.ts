import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n')
  .map((line) => line.split(' ').map(((val) => parseInt(val, 10))));

function isSafe(levels: number[]): boolean {
  const lineSign = Math.sign(levels[1] - levels[0]);

  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i] - levels[i - 1];

    if (Math.sign(diff) !== lineSign) {
      return false;
    }

    const absDiff = Math.abs(diff);
    if (absDiff < 1 || absDiff > 3) {
      return false;
    }
  }

  return true;
}

const safeLines = lines.filter((line) => isSafe(line)).length;
console.log(`Safe reports: ${safeLines}`);

const safeLinesWithDampener = lines.filter((line) => {
  if (isSafe(line)) {
    return true;
  }

  for (let i = 0; i < line.length; i++) {
    if (isSafe(line.toSpliced(i, 1))) {
      return true;
    }
  }

  return false;
}).length;
console.log(`Safe reports with problem dampener: ${safeLinesWithDampener}`);
