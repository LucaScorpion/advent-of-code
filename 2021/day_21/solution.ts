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
