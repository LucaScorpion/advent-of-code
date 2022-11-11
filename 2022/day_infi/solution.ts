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

// Part 1

let pos: Vector2 = { x: 0, y: 0 };
let rot = 0;

instructions.forEach((i) => {
  if (i.type === 'draai') {
    rot += i.amount;
  } else {
    const rotVec = rotatedForwardVector(rot);
    pos = {
      x: pos.x + rotVec.x * i.amount,
      y: pos.y + rotVec.y * i.amount,
    };
  }
});

console.log(manhattanDistance(pos));
