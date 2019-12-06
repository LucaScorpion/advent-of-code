import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split('\n');
const center = 'COM';

const orbits: { [around: string]: string[] } = {};

input.forEach(orbit => {
  const [around, obj] = orbit.split(')');
  if (!orbits[around]) {
    orbits[around] = [];
  }
  orbits[around].push(obj);
});

function getOrbitCount(around: string, indirect: number = 0): number {
  const objs = orbits[around] || [];
  return indirect + objs.map(obj => getOrbitCount(obj, indirect + 1)).reduce((sum, cur) => sum + cur, 0);
}

console.log('Total number of orbits:', getOrbitCount(center));
