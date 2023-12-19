import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

interface Pos {
  x: number;
  y: number;
}

const right = { x: 1, y: 0 };
const left = { x: -1, y: 0 };
const down = { x: 0, y: 1 };
const up = { x: 0, y: -1 };
const allDeltas = [right, left, down, up];

const tileToDeltas: Record<string, Pos[]> = {
  S: [right, left, down, up],
  '.': [],
  '|': [up, down],
  '-': [left, right],
  L: [up, right],
  J: [up, left],
  7: [left, down],
  F: [right, down],
};

const start: Pos = {
  x: 0,
  y: lines.findIndex((l) => l.includes('S')),
};
start.x = lines[start.y].indexOf('S');

function posEquals(a: Pos, b: Pos) {
  return a.x === b.x && a.y === b.y;
}

function addPos(a: Pos, b: Pos) {
  return ({
    x: a.x + b.x,
    y: a.y + b.y,
  });
}

function isInBounds(p: Pos) {
  return p.y >= 0 && p.y < lines.length && p.x >= 0 && p.x < lines[p.y].length;
}

function connects(from: Pos, to: Pos) {
  const toTile = lines[to.y][to.x];
  return tileToDeltas[toTile]
    .map((d) => addPos(to, d))
    .some((p) => posEquals(p, from));
}

function findConnectingNeighbors(p: Pos) {
  const tile = lines[p.y][p.x];
  return tileToDeltas[tile]
    .map((d) => addPos(p, d))
    .filter(isInBounds)
    .filter((n) => connects(p, n));
}

const distances: Record<string, number> = {};
const searchQueue: [Pos, number][] = [[start, 0]];
const startAdjacents: Pos[] = [];

while (searchQueue.length) {
  const [nextPos, dist] = searchQueue.splice(0, 1)[0];
  const neighbors = findConnectingNeighbors(nextPos);

  neighbors.forEach((n) => {
    const nKey = `${n.x};${n.y}`;
    if (distances[nKey] == null) {
      distances[nKey] = dist + 1;
      searchQueue.push([n, dist + 1]);

      if (dist === 0) {
        startAdjacents.push(n);
      }
    }
  });
}

const maxDist = Math.max(...Object.values(distances));
console.log(`Maximum distance: ${maxDist}`);

let startTile = '';
if (startAdjacents[0].x === startAdjacents[1].x) {
  startTile = '|';
} else if (startAdjacents[0].y === startAdjacents[1].y) {
  startTile = '-';
} else if (startAdjacents.some((s) => s.x > start.x)) {
  startTile = startAdjacents.some((s) => s.y > start.y) ? 'F' : 'L'
} else {
  startTile = startAdjacents.some((s) => s.y > start.y) ? '7' : 'J';
}

if (!startTile) {
  throw new Error('Could not determine start tile.');
}
lines[start.y] = lines[start.y].replace('S', startTile);

function isMainLoop(x: number, y: number) {
  return distances[`${x};${y}`] != null;
}

const cornerCombos = ['FJ', 'L7'];
let enclosed = 0;
lines.forEach((l, y) => {
  let inside = false;
  let lastCorner = '';

  for (let x = 0; x < l.length; x++) {
    if (isMainLoop(x, y)) {
      const tile = l[x];

      if (tile === '|') {
        inside = !inside;
      } else if (tile != '-') {
        if (lastCorner) {
          if (cornerCombos.includes(`${lastCorner}${tile}`)) {
            inside = !inside;
          }

          lastCorner = '';
        } else {
          lastCorner = tile;
        }
      }
    } else if (inside) {
      enclosed++;
    }
  }
});

console.log(`Enclosed tiles: ${enclosed}`);
