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

function isInBounds(p: Pos) {
  return p.y >= 0 && p.y < lines.length && p.x >= 0 && p.x < lines[p.y].length;
}

function connects(from: Pos, to: Pos) {
  const toTile = lines[to.y][to.x];
  return tileToDeltas[toTile]
    .map((d) => ({
      x: to.x + d.x,
      y: to.y + d.y,
    }))
    .some((p) => posEquals(p, from));
}

function findConnectingNeighbors(p: Pos) {
  const tile = lines[p.y][p.x];
  return tileToDeltas[tile]
    .map((d) => ({
      x: p.x + d.x,
      y: p.y + d.y,
    }))
    .filter(isInBounds)
    .filter((n) => connects(p, n));
}

const distances: Record<string, number> = {};
const searchQueue: [Pos, number][] = [[start, 0]];

while (searchQueue.length > 0) {
  const [nextPos, dist] = searchQueue.splice(0, 1)[0];
  const neighbors = findConnectingNeighbors(nextPos);

  neighbors.forEach((n) => {
    const nKey = `${n.x};${n.y}`;

    if (distances[nKey] == null) {
      distances[nKey] = dist + 1;
      searchQueue.push([n, dist + 1]);
    }
  });
}

const maxDist = Math.max(...Object.values(distances));
console.log(maxDist);
