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

const allExtrapolated: number[][][] = [];

lines.forEach((l) => {
  const extrapolated = [l];

  while (true) {
    const newDiffs = diffs(extrapolated[extrapolated.length - 1]);
    extrapolated.push(newDiffs);

    if (newDiffs.every((d) => d === 0)) {
      break;
    }
  }

  for (let i = extrapolated.length - 2; i >= 0; i--) {
    const cur = extrapolated[i];
    const below = extrapolated[i + 1];
    cur.push(cur[cur.length - 1] + below[below.length - 1]);
  }

  allExtrapolated.push(extrapolated);
});

const res = allExtrapolated.reduce((acc, cur) => acc + cur[0][cur[0].length - 1], 0);
console.log(res);
