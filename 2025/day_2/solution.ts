import * as fs from 'fs';

const ranges: [number, number][] = fs.readFileSync(0).toString().trim().replaceAll('\n', '')
  .split(',')
  .map((r) => r.split('-').map(Number) as [number, number]);

const invalidIds: number[] = [];

ranges.forEach((r) => {
  for (let i = r[0]; i <= r[1]; i++) {
    if (!isValidId(i)) {
      invalidIds.push(i);
    }
  }
});

function isValidId(id: number): boolean {
  const idString = id.toString();
  const firstHalf = idString.substring(0, idString.length / 2);
  const lastHalf = idString.substring(idString.length / 2);
  return firstHalf !== lastHalf;
}

const sum = invalidIds.reduce((acc, cur) => acc + cur, 0);
console.log(`Sum of invalid ids: ${sum}`);
