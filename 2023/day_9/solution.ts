import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n')
  .map((l) => l.split(' ').map((v) => parseInt(v)));

function diffs(nums: number[]) {
  const result: number[] = [];
  for (let i = 0; i < nums.length - 1; i++) {
    result[i] = nums[i + 1] - nums[i];
  }
  return result;
}

function extrapolate(row: number[]) {
  const result = [[...row]];

  while (true) {
    const newDiffs = diffs(result[result.length - 1]);
    result.push(newDiffs);

    if (newDiffs.every((d) => d === 0)) {
      break;
    }
  }

  for (let i = result.length - 2; i >= 0; i--) {
    const cur = result[i];
    const below = result[i + 1];
    cur.push(cur[cur.length - 1] + below[below.length - 1]);
  }

  return result;
}

const rightExtrapolated: number[][][] = [];
lines.forEach((l) => {
  rightExtrapolated.push(extrapolate(l));
});

const leftExtrapolated: number[][][] = [];
lines.forEach((l) => {
  leftExtrapolated.push(extrapolate(l.toReversed()));
});

const rightResult = rightExtrapolated.reduce((acc, cur) => acc + cur[0][cur[0].length - 1], 0);
console.log(`Right extrapolated: ${rightResult}`);

const leftResult = leftExtrapolated.reduce((acc, cur) => acc + cur[0][cur[0].length - 1], 0);
console.log(`Left extrapolated: ${leftResult}`);
