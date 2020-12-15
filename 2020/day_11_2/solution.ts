import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map((line) => line.split(''));

function firstVisibleSeat(map: string[][], x: number, y: number, dX: number, dY: number): string | undefined {
  let checkX = x + dX;
  let checkY = y + dY;
  while (checkX >= 0 && checkY >= 0 && checkY < map.length && checkX < map[checkY].length) {
    const char = map[checkY][checkX];
    if (char !== '.') {
      return char;
    }

    checkX += dX;
    checkY += dY;
  }
  return undefined;
}

function countOccupiedVisible(map: string[][], x: number, y: number): number {
  return [
    firstVisibleSeat(map, x, y, 1, 0),
    firstVisibleSeat(map, x, y, 1, 1),
    firstVisibleSeat(map, x, y, 0, 1),
    firstVisibleSeat(map, x, y, -1, 1),
    firstVisibleSeat(map, x, y, -1, 0),
    firstVisibleSeat(map, x, y, -1, -1),
    firstVisibleSeat(map, x, y, 0, -1),
    firstVisibleSeat(map, x, y, 1, -1),
  ].filter((seat) => seat === '#').length;
}

function nextState(map: string[][], x: number, y: number): string {
  const adjOccupied = countOccupiedVisible(map, x, y);
  const current = map[y][x];

  if (current === 'L' && adjOccupied === 0) {
    return '#';
  }
  if (current === '#' && adjOccupied >= 5) {
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
