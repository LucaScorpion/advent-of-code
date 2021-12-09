import fs from 'fs';

const grid = fs.readFileSync(0).toString().trim().split('\n').map((l) => l.split('')).map((l) => l.map(Number));

interface Cell {
  x: number;
  y: number;
  height: number;
}

function getCell(x: number, y: number): Cell | undefined {
  if (x >= 0 && y >= 0 && y < grid.length && x < grid[y].length) {
    return {
      x,
      y,
      height: grid[y][x],
    };
  }
}

function getCoordString(x: number, y: number): string {
  return `${x};${y}`;
}

let totalLowPointRisk = 0;

// Sink coords to list of basin coords.
const basins: Record<string, string[]> = {};

// Cell coords to corresponding sink coords.
const cellToSink: Record<string, string> = {};

function findSink(x: number, y: number): string {
  const coord = getCoordString(x, y);

  // Check if we already know this cell.
  if (cellToSink[coord]) {
    return cellToSink[coord];
  }

  // Find the lowest adjacent cell.
  const adjacent = [getCell(x - 1, y), getCell(x + 1, y), getCell(x, y - 1), getCell(x, y + 1)]
    .filter((c): c is Cell => c != null);
  const lowestAdjacent = adjacent.reduce((acc, cur) => cur.height < acc.height ? cur : acc);

  // If there is no way down, this cell is the sink.
  const height = grid[y][x];
  if (lowestAdjacent.height > height) {
    // Check if we already know this sink.
    if (!basins[coord]) {
      basins[coord] = [];
      totalLowPointRisk += height + 1;
    }

    return coord;
  }

  const sink = findSink(lowestAdjacent.x, lowestAdjacent.y);
  cellToSink[coord] = sink;
  return sink;
}

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const height = grid[y][x];

    // Skip height 9 cells.
    if (height === 9) {
      continue;
    }

    basins[findSink(x, y)].push(getCoordString(x, y));
  }
}

console.log(`Total risk level of low points: ${totalLowPointRisk}`);

const threeLargestBasins = Object.values(basins)
  .sort((a, b) => b.length - a.length)
  .slice(0, 3)
  .map((b) => b.length)
  .reduce((acc, cur) => acc * cur);

console.log(`Three largest basins: ${threeLargestBasins}`);
