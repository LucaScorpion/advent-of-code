import fs from 'fs';

const grid = fs.readFileSync(0).toString().trim().split('\n').map((l) => l.split('')).map((l) => l.map(Number));

function getCell(x: number, y: number): number | undefined {
  if (x >= 0 && y >= 0 && y < grid.length && x < grid[y].length) {
    return grid[y][x];
  }
}

let totalRisk = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const height = grid[y][x];
    const adjacent = [getCell(x - 1, y), getCell(x + 1, y), getCell(x, y - 1), getCell(x, y + 1)]
      .filter((c): c is number => c != null);

    if (height < Math.min(...adjacent)) {
      totalRisk += height + 1;
    }
  }
}

console.log(`Total risk level of low points: ${totalRisk}`);
