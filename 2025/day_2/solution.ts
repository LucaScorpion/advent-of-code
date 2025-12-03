import * as fs from 'fs';

const ranges: [number, number][] = fs.readFileSync(0).toString().trim().replaceAll('\n', '')
  .split(',')
  .map((r) => r.split('-').map(Number) as [number, number]);

const invalidIds1: number[] = [];
const invalidIds2: number[] = [];

ranges.forEach((r) => {
  for (let i = r[0]; i <= r[1]; i++) {
    if (!isValidId1(i)) {
      invalidIds1.push(i);
    }
    if (!isValidId2(i)) {
      invalidIds2.push(i);
    }
  }
});

function isValidId1(id: number): boolean {
  const idString = id.toString();
  const firstHalf = idString.substring(0, idString.length / 2);
  const lastHalf = idString.substring(idString.length / 2);
  return firstHalf !== lastHalf;
}

function isValidId2(id: number): boolean {
  const idString = id.toString();
  for (let i = 1; i <= idString.length / 2; i++) {
    const part = idString.substring(0, i);
    const partRepeated = part.repeat(idString.length / part.length);
    if (partRepeated === idString) {
      return false;
    }
  }
  return true;
}

console.log(`Sum of invalid ids 1: ${invalidIds1.reduce((acc, cur) => acc + cur, 0)}`);
console.log(`Sum of invalid ids 2: ${invalidIds2.reduce((acc, cur) => acc + cur, 0)}`);
