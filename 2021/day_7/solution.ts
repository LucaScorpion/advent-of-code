import fs from 'fs';

const startPositions = fs.readFileSync(0).toString().trim().split(',').map(Number);

function calcFuelReq(pos: number): number {
  return startPositions.map((p) => Math.abs(pos - p)).reduce((acc, cur) => acc + cur, 0);
}

const maxPosition = Math.max(...startPositions);

let minFuelReq = Number.POSITIVE_INFINITY;
let minFuelReqPos = 0;
for (let i = 0; i <= maxPosition; i++) {
  const fuelReq = calcFuelReq(i);
  if (fuelReq < minFuelReq) {
    minFuelReq = fuelReq;
    minFuelReqPos = i;
  }
}

console.log(`Fuel requirement to align at position ${minFuelReqPos}: ${minFuelReq}`);
