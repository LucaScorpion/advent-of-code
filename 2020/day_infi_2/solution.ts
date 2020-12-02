import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/).map(line => parseInt(line, 10));

function calculateVolume(size: number): number {
  // The top third of the bag.
  //   __
  //  /..\
  // /....\
  let topThirdCount = 0;
  for (let row = 0; row < size; row++) {
    const rowCount = size + 2 * row;
    topThirdCount += rowCount;
  }

  // Middle part.
  // |......|
  // |......|
  const midCount = size * (3 * size);

  return topThirdCount * 2 + midCount;
}

function calculateCircumference(size: number): number {
  return 8 * size;
}

function calculateSize(volume: number): number {
  for (let size = 1; ; size++) {
    const check = calculateVolume(size);
    if (check >= volume) {
      return size;
    }
  }
}

const total = input.map(calculateSize).map(calculateCircumference).reduce((acc, cur) => acc + cur, 0);
console.log('Fabric needed:', total);
