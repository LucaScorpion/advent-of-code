import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');
const timeCols = lines[0].split(' ').filter((c) => !!c).slice(1);
const distCols = lines[1].split(' ').filter((c) => !!c).slice(1);

interface Race {
  duration: number;
  recordDistance: number;
}

const races: Race[] = timeCols.map((c, i) => ({
  duration: parseInt(c),
  recordDistance: parseInt(distCols[i]),
}));

function calculateDistance(raceDuration: number, holdTime: number) {
  const moveTime = raceDuration - holdTime;
  return moveTime * holdTime; // holdTime == speed
}

const winOptions = races.map((r) => {
  let winCount = 0;
  for (let holdTime = 0; holdTime <= r.duration; holdTime++) {
    if (calculateDistance(r.duration, holdTime) > r.recordDistance) {
      winCount++;
    }
  }
  return winCount;
});

console.log(winOptions.reduce((acc, cur) => acc * cur, 1));
