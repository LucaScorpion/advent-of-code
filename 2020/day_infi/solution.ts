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

// Alternative volume calculation, thanks to Mainlypastries :D
function calculateVolume2(size: number): number {
  const n = size - 1;
  return 5 * size * size + 4 * ((n * size) / 2);
}

for (let size = 1; ;size++) {
  const volume = calculateVolume(size);
  if (volume >= input) {
    console.log('Size:', size);
    break;
  }
}
