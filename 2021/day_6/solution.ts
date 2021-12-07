import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(',').map(Number);
const breedTime = 7;
const newBreedTime = breedTime + 2;
const part1Days = 80;
const part2Days = 256;

let fish = Array(newBreedTime).fill(0);

input.forEach((f) => {
  fish[f]++;
});

function simulateDay(): void {
  const result = Array(newBreedTime).fill(0);

  // Breed new fish.
  result[newBreedTime - 1] = fish[0];
  result[breedTime - 1] = fish[0];

  // Reduce all timers.
  for (let i = 1; i < fish.length; i++) {
    result[i - 1] += fish[i];
  }

  fish = result;
}

function logFish(days: number): void {
  const totalFish = fish.reduce((acc, cur) => acc + cur, 0);
  console.log(`Fish after ${days} days: ${totalFish}`);
}

for (let i = 0; i < part2Days; i++) {
  simulateDay();

  if (i === part1Days - 1) {
    logFish(part1Days);
  }
}

logFish(part2Days);
