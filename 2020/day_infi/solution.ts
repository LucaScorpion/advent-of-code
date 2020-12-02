import fs from 'fs';

const input = parseInt(fs.readFileSync(0).toString().trim(), 10);

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
  const midCount = size * (3 * size); // 3 * size + size * size

  return topThirdCount * 2 + midCount;
}

for (let size = 1; ;size++) {
  const volume = calculateVolume(size);
  if (volume >= input) {
    console.log('Size:', size);
    break;
  }
}
