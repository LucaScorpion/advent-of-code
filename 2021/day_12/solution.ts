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

function findPaths(from: Cave, path: string[]): string[][] {
  if (from.name === 'end') {
    return [path];
  }

  const resultPaths: string[][] = [];

  from.neighbors.forEach((neighborName) => {
    const neighbor = getCave(neighborName);

    // Only visit small caves at most once.
    if (neighbor.small && path.includes(neighbor.name)) {
      return;
    }

    const newPath = [...path, neighbor.name];
    resultPaths.push(...findPaths(neighbor, newPath));
  });

  return resultPaths;
}

const paths = findPaths(getCave('start'), ['start']);
console.log(`Available paths: ${paths.length}`);
