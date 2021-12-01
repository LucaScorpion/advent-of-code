import fs from 'fs';

const depths = fs.readFileSync(0).toString().trim().split('\n').map((l) => parseInt(l, 10));

let increases = 0;
for (let i = 1; i < depths.length; i++) {
  if (depths[i] > depths[i - 1]) {
    increases++;
  }
}

console.log('Single measurement increments:', increases);

let windowIncreases = 0;
for (let i = 3; i < depths.length; i++) {
  const prevWindow = depths[i - 3] + depths[i - 2] + depths[i - 1];
  const window = depths[i - 2] + depths[i - 1] + depths[i];
  if (window > prevWindow) {
    windowIncreases++;
  }
}

console.log('Window measurement increments:', windowIncreases);
