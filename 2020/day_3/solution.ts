import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map(line => line.split('') as Cell[]);

type Cell = '.' | '#';

interface Slope {
  right: number;
  down: number;
}

const slopes: Slope[] = [
  { right: 1, down: 1 },
  { right: 3, down: 1 },
  { right: 5, down: 1 },
  { right: 7, down: 1 },
  { right: 1, down: 2 },
];

function getSquare(rowNum: number, colNum: number): Cell {
  const row = input[rowNum];
  return row[colNum % row.length];
}

function getTrajectory(slope: Slope): Cell[] {
  const trajectory: Cell[] = [];
  let x = slope.right;
  let y = slope.down;

  while (y < input.length) {
    trajectory.push(getSquare(y, x));
    x += slope.right;
    y += slope.down;
  }

  return trajectory;
}

function countTrees(slope: Slope): number {
  const traj = getTrajectory(slope);
  return traj.filter(c => c === '#').length;
}

let treesMultiplied = 1;

slopes.forEach(s => {
  const treeCount = countTrees(s);
  console.log(`Slope ${s.right},${s.down}, trees: ${treeCount}`);
  treesMultiplied *= treeCount;
});

console.log('Trees multiplied:', treesMultiplied);
