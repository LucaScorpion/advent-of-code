import fs from 'fs';

const [rawCoords, rawFolds] = fs.readFileSync(0).toString().trim().split('\n\n');

interface Position {
  x: number;
  y: number;
}

type Orientation = 'x' | 'y';

interface Fold {
  orientation: Orientation,
  position: number;
}

const startDots: Position[] = rawCoords.split('\n').map((line) => {
  const [x, y] = line.split(',').map(Number);
  return { x, y };
});

const folds: Fold[] = rawFolds.split('\n').map((line) => {
  const [orientation, rawPosition] = line.split(' ')[2].split('=');
  return {
    orientation: orientation as Orientation,
    position: Number(rawPosition),
  };
});

function fold(dots: Position[], f: Fold): Position[] {
  const result: Position[] = [];

  dots.forEach((dot) => {
    let newDot = { ...dot };

    // Mirror the dot.
    const checkPos = newDot[f.orientation];
    if (checkPos > f.position) {
      newDot[f.orientation] = checkPos - 2 * (checkPos - f.position);
    }

    // Check if the dot already exists.
    if (!result.find((d) => d.x === newDot.x && d.y === newDot.y)) {
      result.push(newDot);
    }
  });

  return result;
}

function drawDots(dots: Position[]): void {
  const maxPos = dots.reduce((acc, cur) => ({
    x: Math.max(acc.x, cur.x),
    y: Math.max(acc.y, cur.y),
  }));

  const grid: boolean[][] = Array(maxPos.y + 1).fill([]);
  grid.forEach((_, i) => grid[i] = Array(maxPos.x + 1).fill(false));

  dots.forEach((dot) => {
    grid[dot.y][dot.x] = true;
  });

  console.log(grid.map((row) => row.map((c) => c ? '\x1b[7;8m#\x1b[0m' : ' ').join('')).join('\n'));
}

let afterFolds = fold(startDots, folds[0]);
console.log(`Dots after one fold: ${afterFolds.length}`);

for (let i = 1; i < folds.length; i++) {
  afterFolds = fold(afterFolds, folds[i]);
}

console.log('After all folds:\n');
drawDots(afterFolds);
