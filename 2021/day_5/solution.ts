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

function processLines(lines: Line[]): number[][] {
  const grid: number[][] = [];

  lines.forEach((l) => {
    const xSign = Math.sign(l.to.x - l.from.x);
    const ySign = Math.sign(l.to.y - l.from.y);

    let curPos: Position = { ...l.from };
    while (curPos.x !== l.to.x || curPos.y !== l.to.y) {
      addVentToGrid(grid, curPos);
      curPos = {
        x: curPos.x + xSign,
        y: curPos.y + ySign,
      };
    }
    addVentToGrid(grid, curPos);
  });

  return grid;
}

const horVertVentLines = ventLines.filter((l) => l.from.x === l.to.x || l.from.y === l.to.y);
const horVertGrid = processLines(horVertVentLines);
// drawGrid(horVertGrid);
const horVertOverlapCount = horVertGrid.flat().filter((n) => n > 1).length;
console.log(`Overlapping horizontal and vertical lines: ${horVertOverlapCount}`);

const fullGrid = processLines(ventLines);
// drawGrid(fullGrid);
const overlapCount = fullGrid.flat().filter((n) => n > 1).length;
console.log(`Overlapping lines: ${overlapCount}`);
