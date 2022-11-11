import fs from 'fs';

const instructions: Instruction[] = fs.readFileSync(0).toString().trim().split('\n')
  .map((l) => {
    const [type, rawAmount] = l.split(' ');
    return {
      type: type as Move,
      amount: parseInt(rawAmount, 10),
    };
  });

type Move = 'draai' | 'loop' | 'spring';

interface Instruction {
  type: Move;
  amount: number;
}

interface Vector2 {
  x: number;
  y: number;
}

function rotatedForwardVector(deg: number): Vector2 {
  const rad = -deg * (Math.PI / 180);
  return {
    x: roundAwayFromZero(roundToHalf(-Math.sin(rad))),
    y: roundAwayFromZero(roundToHalf(Math.cos(rad))),
  };
}

function roundToHalf(val: number): number {
  return Math.round(val * 2) / 2;
}

function roundAwayFromZero(val: number): number {
  const halfRound = Math.round(val * 2) / 2;
  if (val > 0) {
    return Math.ceil(halfRound);
  } else {
    return Math.floor(halfRound);
  }
}

function manhattanDistance(vec: Vector2): number {
  return Math.abs(vec.x) + Math.abs(vec.y);
}

function vecString(vec: Vector2): string {
  return `${vec.x};${vec.y}`;
}

let pos: Vector2 = { x: 0, y: 0 };
let rot = 0;
const grid = {
  x: [0, 0],
  y: [0, 0],
  steps: new Set<string>(),
};

instructions.forEach((i) => {
  if (i.type === 'draai') {
    rot += i.amount;
    return;
  }

  const rotVec = rotatedForwardVector(rot);
  if (i.type === 'spring') {
    pos = {
      x: pos.x + rotVec.x * i.amount,
      y: pos.y + rotVec.y * i.amount,
    };
    setStep();
  } else {
    for (let d = 0; d < i.amount; d++) {
      pos = {
        x: pos.x + rotVec.x,
        y: pos.y + rotVec.y,
      };
      setStep();
    }
  }
});

function setStep(): void {
  if (pos.x < grid.x[0]) {
    grid.x[0] = pos.x;
  }
  if (pos.x > grid.x[1]) {
    grid.x[1] = pos.x;
  }
  if (pos.y < grid.y[0]) {
    grid.y[0] = pos.y;
  }
  if (pos.y > grid.y[1]) {
    grid.y[1] = pos.y;
  }
  grid.steps.add(vecString(pos));
}

console.log(`Manhattan distance moved: ${manhattanDistance(pos)}`);
console.log('Path:\n');
for (let y = grid.y[1]; y >= grid.y[0]; y--) {
  for (let x = grid.x[0]; x <= grid.x[1]; x++) {
    process.stdout.write(grid.steps.has(vecString({ x, y })) ? '#' : ' ');
  }
  process.stdout.write('\n');
}
