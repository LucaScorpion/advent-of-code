import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split('\n');

interface Position {
  x: number;
  y: number;
}

interface Line {
  from: Position;
  to: Position;
}

let gridWidth = 0;
const ventLines: Line[] = input.map((l) => {
  const [rawFrom, _, rawTo] = l.split(' ');
  const [fromX, fromY] = rawFrom.split(',').map(Number);
  const [toX, toY] = rawTo.split(',').map(Number);

  gridWidth = Math.max(gridWidth, fromX, toX);

  return {
    from: {
      x: fromX,
      y: fromY,
    },
    to: {
      x: toX,
      y: toY,
    },
  };
});

function addVentToGrid(grid: number[][], pos: Position): void {
  if (!grid[pos.y]) {
    grid[pos.y] = [];
  }

  grid[pos.y][pos.x] = grid[pos.y][pos.x] == null ? 1 : grid[pos.y][pos.x] + 1;
}

function drawGrid(grid: number[][]): void {
  for (const row of grid) {
    let rowStr = '';
    for (let x = 0; x < gridWidth; x++) {
      rowStr = `${rowStr}${(row || [])[x] || '.'}`;
    }
    console.log(rowStr);
  }
}

const horVertVentLines = ventLines.filter((l) => l.from.x === l.to.x || l.from.y === l.to.y);
const horVertGrid: number[][] = [];
horVertVentLines.forEach((v) => {
  const fromX = Math.min(v.from.x, v.to.x);
  const toX = Math.max(v.from.x, v.to.x);
  const fromY = Math.min(v.from.y, v.to.y);
  const toY = Math.max(v.from.y, v.to.y);

  for (let x = fromX; x <= toX; x++) {
    for (let y = fromY; y <= toY; y++) {
      addVentToGrid(horVertGrid, { x, y });
    }
  }
});

// drawGrid(horVertGrid);

const overlapCount = horVertGrid.flat().filter((n) => n > 1).length;
console.log(`Overlapping lines: ${overlapCount}`);
