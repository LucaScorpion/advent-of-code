import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

type Color = 'red' | 'green' | 'blue';

type CubeSet = Record<Color, number>;

interface Game {
  id: number;
  sets: CubeSet[];
}

const games: Game[] = lines.map((l) => {
  const [rawId, rawSets] = l.split(': ');

  return {
    id: parseInt(rawId.substring(5), 10),
    sets: rawSets.split('; ').map((rawSet) => {
      const rawParts = rawSet.split(', ');
      const set: CubeSet = {
        red: 0,
        green: 0,
        blue: 0,
      };

      rawParts.forEach((p) => {
        const [rawAmount, color] = p.split(' ');
        set[color as Color] = parseInt(rawAmount, 10);
      });

      return set;
    }),
  };
});

function isPossible(game: Game, check: CubeSet): boolean {
  return game.sets.every((set) => {
    return set.blue <= check.blue && set.red <= check.red && set.green <= check.green;
  });
}

const possibleGames = games.filter((g) => isPossible(g, {
  red: 12,
  green: 13,
  blue: 14,
}));
const sum = possibleGames.reduce((acc, cur) => acc + cur.id, 0);
console.log(`Sum of ids: ${sum}`);

function minCubeSet(game: Game): CubeSet {
  return {
    red: Math.max(...game.sets.map((s) => s.red)),
    green: Math.max(...game.sets.map((s) => s.green)),
    blue: Math.max(...game.sets.map((s) => s.blue)),
  }
}

const minCubeSets = games.map((g) => minCubeSet(g));
const power = minCubeSets.reduce((acc, cur) => acc + (cur.green * cur.red * cur.blue), 0);
console.log(`Sum of powers: ${power}`);
