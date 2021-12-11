import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split('\n').map((l) => l.split('').map(Number));
const STEPS = 100;
const FLASH_ENERGY = 10;
const octopusCount = input.length * input[0].length;
const fancy = !!process.env.FANCY;

const fancyFlashColors = [
  255,
  249,
  244,
  238,
  232,
];

interface Octopus {
  energy: number;
  flashed: boolean;
  flashStepsAgo: number;
}

const grid: Octopus[][] = input.map((row) => row.map((cell) => ({
  energy: cell,
  flashed: false,
  flashStepsAgo: Number.POSITIVE_INFINITY,
})));

function checkFlash(x: number, y: number): void {
  const cell = grid[y][x];
  if (cell.flashed || cell.energy < FLASH_ENERGY) {
    return;
  }

  cell.flashed = true;
  for (let dY = -1; dY <= 1; dY++) {
    // Get the new neighbor row, check if we are in bounds.
    const newY = y + dY;
    if (newY < 0 || newY >= grid.length) {
      continue;
    }
    const row = grid[newY];

    for (let dX = -1; dX <= 1; dX++) {
      // Skip the current cell.
      if (dY === 0 && dX === 0) {
        continue;
      }

      // Get the neighbor cell, check if we are in bounds.
      const newX = x + dX;
      if (newX < 0 || newX >= row.length) {
        continue;
      }

      row[newX].energy++;
      checkFlash(newX, newY);
    }
  }
}

async function logGrid(): Promise<void> {
  console.clear();
  console.log(grid.map((row) =>
    row.map((cell) => {
      const color = fancyFlashColors[Math.min(cell.flashStepsAgo, fancyFlashColors.length - 1)];
      return `\x1b[38;5;${color}m\x1b[48;5;${color}m##\x1b[0m`;
    }).join(''),
  ).join('\n'));
  await new Promise((res) => setTimeout(res, 100));
}

async function step(): Promise<number> {
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      cell.energy++;
      checkFlash(x, y);
    });
  });

  // Reset all the flashed flags.
  let flashCount = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.flashStepsAgo++;
      if (cell.flashed) {
        cell.energy = 0;
        cell.flashStepsAgo = 0;
        flashCount++;
      }
      cell.flashed = false;
    });
  });

  if (fancy) {
    await logGrid();
  }

  return flashCount;
}

let totalFlashCount = 0;
let synchronizedStepNumber: number | undefined = undefined;

(async () => {
  if (fancy) {
    await logGrid();
  }

  for (let s = 0; s < STEPS; s++) {
    totalFlashCount += await step();
  }

  for (let s = STEPS; synchronizedStepNumber == undefined; s++) {
    if (await step() === octopusCount) {
      synchronizedStepNumber = s + 1;
    }
  }

  console.log(`Total flashes after ${STEPS} steps: ${totalFlashCount}`);
  console.log(`Synchronized flash at step: ${synchronizedStepNumber}`);
})();
