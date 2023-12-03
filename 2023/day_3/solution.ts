import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

const symbolAdjacentNums: number[] = [];
const starAdjacentNums: Record<string, number[]> = {};

lines.forEach((l, y) => {
  for (let x = 0; x < l.length; x++) {
    const char = l[x];

    if (!isDigit(char)) {
      continue;
    }

    let digitStr = char;
    let symbolAdjacent = isSymbolAdjacent(x, y);
    let stars = getAdjacentStars(x, y);
    while (x < l.length - 1 && isDigit(l[x + 1])) {
      x++;
      digitStr = `${digitStr}${l[x]}`;

      if (!symbolAdjacent) {
        symbolAdjacent = isSymbolAdjacent(x, y);
      }

      stars.push(...getAdjacentStars(x, y));
    }

    if (symbolAdjacent) {
      symbolAdjacentNums.push(parseInt(digitStr));
    }

    [...new Set<string>(stars)].forEach((starCoord) => {
      if (!starAdjacentNums[starCoord]) {
        starAdjacentNums[starCoord] = [];
      }
      starAdjacentNums[starCoord].push(parseInt(digitStr));
    });
  }
});

const adjacentSum = symbolAdjacentNums.reduce((acc, cur) => acc + cur, 0);
console.log(`Sum of symbol-adjacent parts: ${adjacentSum}`);

let totalRatio = 0;
Object.entries(starAdjacentNums).forEach(([, nums]) => {
  if (nums.length === 2) {
    totalRatio += nums[0] * nums[1];
  }
});
console.log(`Sum of gear ratios: ${totalRatio}`);

function isDigit(s: string) {
  return !isNaN(parseInt(s));
}

function isSymbolAdjacent(x: number, y: number): boolean {
  for (let dX = -1; dX <= 1; dX++) {
    const checkX = x + dX;

    for (let dY = -1; dY <= 1; dY++) {
      const checkY = y + dY;

      if (dX === 0 && dY === 0) {
        continue;
      }

      if (checkY < 0 || checkY >= lines.length || checkX < 0 || checkX >= lines[checkY].length) {
        continue;
      }

      const char = lines[checkY][checkX];
      if (char !== '.' && !isDigit(char)) {
        return true;
      }
    }
  }

  return false;
}

function getAdjacentStars(x: number, y: number) {
  const starCoords: string[] = [];

  for (let dX = -1; dX <= 1; dX++) {
    const checkX = x + dX;

    for (let dY = -1; dY <= 1; dY++) {
      const checkY = y + dY;

      if (dX === 0 && dY === 0) {
        continue;
      }

      if (checkY < 0 || checkY >= lines.length || checkX < 0 || checkX >= lines[checkY].length) {
        continue;
      }

      const char = lines[checkY][checkX];
      if (char === '*') {
        starCoords.push(`${checkX};${checkY}`);
      }
    }
  }

  return starCoords;
}
