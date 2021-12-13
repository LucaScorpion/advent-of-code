import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

interface Cave {
  name: string;
  neighbors: string[];
  small: boolean;
}

const caves: Cave[] = [];

function findCave(name: string): Cave | undefined {
  return caves.find((c) => c.name === name);
}

function getCave(name: string): Cave {
  const result = findCave(name);
  if (!result) {
    throw new Error(`Could not get cave: ${name}`);
  }
  return result;
}

function storePassage(fromName: string, toName: string): void {
  const fromCave = findCave(fromName);
  if (fromCave) {
    fromCave.neighbors.push(toName);
  } else {
    caves.push({ name: fromName, neighbors: [toName], small: fromName[0].toLowerCase() === fromName[0] });
  }
}

lines.forEach((line) => {
  const [fromName, toName] = line.split('-');
  storePassage(fromName, toName);
  storePassage(toName, fromName);
});

function findPaths(from: Cave, path: string[], revisitedSmallCave: boolean): string[][] {
  if (from.name === 'end') {
    return [path];
  }

  const resultPaths: string[][] = [];

  from.neighbors.forEach((neighborName) => {
    const neighbor = getCave(neighborName);

    // Cannot revisit the start cave.
    if (neighbor.name === 'start') {
      return;
    }

    // Check if we already visited a small cave twice.
    let willRevisitSmall = neighbor.small && path.includes(neighbor.name);
    if (willRevisitSmall && revisitedSmallCave) {
      return;
    }

    const newPath = [...path, neighbor.name];
    resultPaths.push(...findPaths(neighbor, newPath, willRevisitSmall || revisitedSmallCave));
  });

  return resultPaths;
}

const paths1 = findPaths(getCave('start'), ['start'], true);
console.log(`Available paths: ${paths1.length}`);
const paths2 = findPaths(getCave('start'), ['start'], false);
console.log(`Available paths with small revisit: ${paths2.length}`);
