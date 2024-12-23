import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

const xmas = 'XMAS';

function get(x: number, y: number): string | null {
  if (y < 0 || y >= lines.length || x < 0 || x >= lines[y].length) {
    return null;
  }
  return lines[y][x];
}

const directions: [number, number][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], /*    */ [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function countXmas(): number {
  let total = 0;

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      total += directions.filter((d) => isXmas(x, y, d)).length;
    }
  }

  return total;
}

function isXmas(originX: number, originY: number, [dX, dY]: [number, number], wordIndex = 0): boolean {
  const x = originX + (dX * wordIndex);
  const y = originY + (dY * wordIndex);
  const match = get(x, y) === xmas[wordIndex];

  if (wordIndex === xmas.length - 1) {
    return match;
  }

  return match && isXmas(originX, originY, [dX, dY], wordIndex + 1);
}

console.log(`Total XMAS: ${countXmas()}`);

function countXmas2(): number {
  let total = 0;

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (isXmas2(x, y)) {
        total++;
      }
    }
  }

  return total;
}

function isXmas2(x: number, y: number): boolean {
  if (get(x, y) !== 'A') {
    return false;
  }

  const topLeftBottomRight = `${get(x - 1, y - 1)}${get(x + 1, y + 1)}`
  const bottomLeftTopRight = `${get(x - 1, y + 1)}${get(x + 1, y - 1)}`

  return (
    (topLeftBottomRight === 'MS' || topLeftBottomRight === 'SM') &&
    (bottomLeftTopRight === 'MS' || bottomLeftTopRight === 'SM')
  );
}

console.log(`Total X-MAS: ${countXmas2()}`);
