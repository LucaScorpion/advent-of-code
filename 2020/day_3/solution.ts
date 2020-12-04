import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map(line => line.split('') as Cell[]);

type Cell = '.' | '#';

function getSquare(rowNum: number, colNum: number): Cell {
  const row = input[rowNum];
  return row[colNum % row.length];
}

function getTrajectory(right: number, down: number): Cell[] {
  const trajectory: Cell[] = [];
  let x = right;
  let y = down;

  while (y < input.length) {
    trajectory.push(getSquare(y, x));
    x += right;
    y += down;
  }

  return trajectory;
}

const traj = getTrajectory(3, 1);
const treeCount = traj.filter(c => c === '#').length;

console.log('Encountered', treeCount, 'trees');
