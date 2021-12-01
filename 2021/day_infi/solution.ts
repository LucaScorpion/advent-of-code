import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

const missingParts = parseInt(lines[0].split(' ')[0], 10);
const alreadyWrapped = 20;

type PartBreakdown = Record<string, number>;

const partBreakdowns: Record<string, PartBreakdown> = {};
const subPartNames = new Set<string>();

// Parse the part breakdowns per part.
for (let i = 1; i < lines.length; i++) {
  const [name, rawBreakdown] = lines[i].split(': ');
  const breakdown: PartBreakdown = {};

  const rawBreakdownParts = rawBreakdown.split(', ');
  rawBreakdownParts.forEach((part) => {
    const [partNum, partName] = part.split(' ');
    breakdown[partName] = parseInt(partNum, 10);
    subPartNames.add(partName);
  });

  partBreakdowns[name] = breakdown;
}

// Count the total number of sub-parts per part.
function countParts(name: string): number {
  const breakdown = partBreakdowns[name];
  if (!breakdown) {
    return 1;
  }

  let total = 0;
  Object.entries(breakdown).forEach(([sub, amount]) => {
    total += countParts(sub) * amount;
  });
  return total;
}

// Part 1.
let largestPartName = '';
let largestPartCount = 0;

// Get the part count for all items.
const partCounts: Record<string, number> = {};
Object.keys(partBreakdowns).forEach((name) => {
  const count = countParts(name);
  partCounts[name] = count;

  // Store the largest part.
  if (count > largestPartCount) {
    largestPartCount = count;
    largestPartName = name;
  }
});

console.log(`Largest part: ${largestPartName}, ${largestPartCount} parts`);

// Find all toys: items that are not a part of another item.
const toyNames = Object.keys(partBreakdowns).filter((n) => !subPartNames.has(n));

const missingToysChecked: Record<string, number> = {};

function search(toys: string[], partCount: number): string[] | undefined {
  // Check if we've found a solution.
  if (toys.length === alreadyWrapped && partCount === missingParts) {
    return toys;
  }

  // Check if we've overshot the number of missing parts or amount of toys.
  if (partCount > missingParts || toys.length >= alreadyWrapped) {
    return;
  }

  // Try adding each toy to the list.
  for (const item of toyNames) {
    const newList = [...toys, item].sort();

    // Check if we already tried this solution.
    const key = newList.join('|');
    if (missingToysChecked[key]) {
      continue;
    }

    // Calculate and store the new part count.
    const newPartCount = partCount + partCounts[item];
    missingToysChecked[key] = newPartCount

    const check = search(newList, newPartCount);
    if (check) {
      return check;
    }
  }
}

const missingToys = search([], 0)
if (!missingToys) {
  throw new Error('Did not find missing parts!');
}

const missingToyLetters = missingToys.map((n) => n.substring(0, 1)).sort().join('');
console.log('Missing toys:', missingToyLetters);
