import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');
const timeCols = lines[0].split(' ').filter((c) => !!c).slice(1);
const distCols = lines[1].split(' ').filter((c) => !!c).slice(1);

interface Race {
  duration: number;
  recordDistance: number;
}

const shortRaces: Race[] = timeCols.map((c, i) => ({
  duration: parseInt(c),
  recordDistance: parseInt(distCols[i]),
}));

function calculateDistance(raceDuration: number, holdTime: number) {
  const moveTime = raceDuration - holdTime;
  return moveTime * holdTime; // holdTime == speed
}

function calculateWinOptions(race: Race) {
  let winCount = 0;
  for (let holdTime = 0; holdTime <= race.duration; holdTime++) {
    if (calculateDistance(race.duration, holdTime) > race.recordDistance) {
      winCount++;
    }
  }
  return winCount;
}

const shortWinOptions = shortRaces.map(calculateWinOptions).reduce((acc, cur) => acc * cur, 1);
console.log(`Short races win options: ${shortWinOptions}`);

const longRace: Race = {
  duration: parseInt(lines[0].substring(5).replaceAll(' ', '')),
  recordDistance: parseInt(lines[1].substring(9).replaceAll(' ', '')),
}
const longWinOptions = calculateWinOptions(longRace);
console.log(`Long race win options: ${longWinOptions}`);
