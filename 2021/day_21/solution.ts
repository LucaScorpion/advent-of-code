import fs from 'fs';

const [p1Start, p2Start] = fs.readFileSync(0).toString().trim().split('\n').map((l) => l.split(': ')[1]).map(Number);
const BOARD_SPACES = 10;

interface Player {
  position: number;
  score: number;
}

function newPosition(oldPos: number, move: number): number {
  return (oldPos + move - 1) % BOARD_SPACES + 1;
}

function deterministicGame(): void {
  const one: Player = {
    position: p1Start,
    score: 0,
  };

  const two: Player = {
    position: p2Start,
    score: 0,
  };

  let totalRolls = 0;
  let player = one;
  while (one.score < 1000 && two.score < 1000) {
    let move = 0;
    for (let i = 0; i < 3; i++) {
      totalRolls++;
      move += (totalRolls - 1) % 100 + 1;
    }

    player.position = newPosition(player.position, move);
    player.score += player.position;

    player = player === one ? two : one;
  }

  const loser = one.score < two.score ? one : two;
  console.log(`Losing score times dice rolls: ${loser.score * totalRolls}`);
}

deterministicGame();

function gameString(p1Pos: number, p1Score: number, p2Pos: number, p2Score: number): string {
  return `${p1Pos}=${p1Score};${p2Pos}=${p2Score}`;
}

const cache: Record<string, [number, number]> = {};

function find(oldPlaying: Player, rollCount: number, roll: number, next: Player): [number, number] {
  const result: [number, number] = [0, 0];

  if (rollCount < 3) {
    for (let r = 1; r <= 3; r++) {
      const sub = find(oldPlaying, rollCount + 1, r + roll, next);
      result[0] += sub[0];
      result[1] += sub[1];
    }
    return result;
  }

  const playing = { ...oldPlaying };
  playing.position = newPosition(playing.position, roll);
  playing.score += playing.position;

  if (playing.score >= 21) {
    return [1, 0];
  }

  const gameKey = gameString(playing.position, playing.score, next.position, next.score);
  const cached = cache[gameKey];
  if (cached) {
    return cached;
  }

  for (let r = 1; r <= 3; r++) {
    const sub = find(next, 1, r, playing);
    result[0] += sub[1];
    result[1] += sub[0];
  }

  cache[gameKey] = result;
  return result;
}

function initFind(): [number, number] {
  const one: Player = {
    position: p1Start,
    score: 0,
  };

  const two: Player = {
    position: p2Start,
    score: 0,
  };

  const result: [number, number] = [0, 0];
  for (let i = 1; i <= 3; i++) {
    const sub = find(one, 1, i, two);
    result[0] += sub[0];
    result[1] += sub[1];
  }
  return result;
}

console.log(`Most wins across dirac universes: ${Math.max(...initFind())}`);
