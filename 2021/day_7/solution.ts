import fs from 'fs';

const startPositions = fs.readFileSync(0).toString().trim().split(',').map(Number);

function linearFuel(pos: number, target: number): number {
  return Math.abs(target - pos);
}

function binomialFuel(pos: number, target: number): number {
  const delta = Math.abs(target - pos);
  return Math.floor((delta * (delta + 1)) / 2);
}

function totalFuelReq(target: number, fuelFunc: (pos: number, target: number) => number): number {
  return startPositions.map((p) => fuelFunc(p, target)).reduce((acc, cur) => acc + cur, 0);
}

const minPosition = Math.min(...startPositions);
const maxPosition = Math.max(...startPositions);

function minFuelReq(fuelFunc: (pos: number, target: number) => number): [number, number] {
  let fuel = Number.POSITIVE_INFINITY;
  let pos = 0;

  for (let i = minPosition; i <= maxPosition; i++) {
    const fuelReq = totalFuelReq(i, fuelFunc);
    if (fuelReq < fuel) {
      fuel = fuelReq;
      pos = i;
    }
  }

  return [pos, fuel];
}

const [linearPos, linearReq] = minFuelReq(linearFuel);
console.log(`Linear fuel requirement to align at position ${linearPos}: ${linearReq}`);
const [binomialPos, binomialReq] = minFuelReq(binomialFuel);
console.log(`Binomial fuel requirement to align at position ${binomialPos}: ${binomialReq}`);
