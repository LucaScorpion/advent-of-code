import fs from 'fs';

const input = fs.readFileSync(0).toString().trim()
  .split(': ')[1]
  .split(', ')
  .map((r) => r.substring(2).split('..').map(Number));

interface Position {
  x: number;
  y: number;
}

interface Range2D {
  min: Position;
  max: Position;
}

const target: Range2D = {
  min: {
    x: input[0][0],
    y: input[1][0],
  },
  max: {
    x: input[0][1],
    y: input[1][1],
  },
};

function step(pos: Position, velocity: Position): void {
  pos.x += velocity.x;
  pos.y += velocity.y;
  velocity.x -= Math.sign(velocity.x);
  velocity.y -= 1;
}

function inTarget(pos: Position): undefined | boolean {
  // Check if we are on target.
  if (pos.x >= target.min.x && pos.x <= target.max.x && pos.y >= target.min.y && pos.y <= target.max.y) {
    return true;
  }

  // Check if we overshot.
  if (pos.x > target.max.x || pos.y < target.min.y) {
    return false;
  }
}

let maxY = Number.NEGATIVE_INFINITY;
for (let x = 0; x < 250; x++) {
  for (let y = 0; y < 250; y++) {
    const probe: Position = { x: 0, y: 0 };
    const velocity: Position = { x, y };
    let checkMaxY = Number.NEGATIVE_INFINITY;

    let hit = inTarget(probe);
    while (hit == undefined) {
      checkMaxY = Math.max(checkMaxY, probe.y);
      step(probe, velocity);
      hit = inTarget(probe);
    }

    if (hit) {
      maxY = Math.max(maxY, checkMaxY);
    }
  }
}

console.log(maxY);
