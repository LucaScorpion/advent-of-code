import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map((line) => line.split(''));

function countOccupiedAdjacent(map: string[][], x: number, y: number): number {
  let count = 0;

  for (let dX = -1; dX <= 1; dX++) {
    for (let dY = -1; dY <= 1; dY++) {
      if (dX === 0 && dY === 0) {
        continue;
      }

      const checkX = x + dX;
      const checkY = y + dY;
      if (checkX < 0 || checkY < 0 || checkY >= map.length || checkX >= map[checkY].length) {
        continue;
      }

      const char = map[checkY][checkX];
      if (char === '#') {
        count++;
      }
    }
  }

  return count;
}

function nextState(map: string[][], x: number, y: number): string {
  const adjOccupied = countOccupiedAdjacent(map, x, y);
  const current = map[y][x];

  if (current === 'L' && adjOccupied === 0) {
    return '#';
  }
  if (current === '#' && adjOccupied >= 4) {
    return 'L';
  }
  return current;
}

function step(map: string[][]): string[][] {
  const next: string[][] = [];

  for (let y = 0; y < map.length; y++) {
    next[y] = [];
    for (let x = 0; x < map[y].length; x++) {
      next[y][x] = nextState(map, x, y);
    }
  }

  return next;
}

function isSame(a: string[][], b: string[][]): boolean {
  for (let y = 0; y < a.length; y++) {
    for (let x = 0; x < a[y].length; x++) {
      if (a[y][x] !== b[y][x]) {
        return false;
      }
    }
  }
  return true;
}

let previousStep = input;
let currentStep = step(input);
while (!isSame(previousStep, currentStep)) {
  previousStep = currentStep;
  currentStep = step(currentStep);
}

const totalOccupied = currentStep.map((row) =>
  row.map((char) => char === '#' ? 1 : 0).reduce<number>((acc, cur) => acc + cur, 0),
).reduce((acc, cur) => acc + cur);

console.log('Occupied:', totalOccupied);
