import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split('\n');

enum Location {
  CENTER = 'COM',
  YOU = 'YOU',
  SANTA = 'SAN',
}

const orbits: { [around: string]: string[] } = {};
const reverseOrbits: { [obj: string]: string } = {};

input.forEach(orbit => {
  const [around, obj] = orbit.split(')');
  if (!orbits[around]) {
    orbits[around] = [];
  }
  orbits[around].push(obj);
  reverseOrbits[obj] = around;
});

function getOrbitCount(around: string, indirect: number = 0): number {
  const objs = orbits[around] || [];
  return indirect + objs.map(obj => getOrbitCount(obj, indirect + 1)).reduce((sum, cur) => sum + cur, 0);
}

function getDistance(from: string | undefined, to: string, soFar: number = 0, visited: Set<string> = new Set<string>()): number | false {
  if (!from || visited.has(from)) {
    return false;
  }

  // Check if we arrived.
  if (from === to) {
    return soFar;
  }

  // Copy the visited set.
  visited = new Set<string>(visited);
  visited.add(from);

  // Get the distances, inward and outward.
  const inDist = getDistance(reverseOrbits[from], to, soFar + 1, visited);
  const outDists = (orbits[from] || []).map(out => getDistance(out, to, soFar + 1, visited));

  // Filter out dead ends, return the smallest distance.
  const distances = [inDist, ...outDists].filter(d => d !== false);
  return distances.length > 0 ? distances.reduce((min, cur) => cur < min ? cur : min) : false;
}

console.log('Total number of orbits:', getOrbitCount(Location.CENTER));
console.log('Orbital transfers required:', getDistance(reverseOrbits[Location.YOU], reverseOrbits[Location.SANTA]));
