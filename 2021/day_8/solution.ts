import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split('\n');

interface Entry {
  patterns: string[];
  value: string[];
}

const entries: Entry[] = input.map((l) => {
  const [rawPatterns, rawValue] = l.split(' | ');
  const patterns = rawPatterns.split(' ');
  const value = rawValue.split(' ');
  return { patterns, value };
});

const simpleValueLengths = new Set([2, 3, 4, 7]);

const simpleValueCount = entries
  .flatMap((e) => e.value)
  .map((v) => v.length)
  .filter((l) => simpleValueLengths.has(l))
  .length;

console.log(`Found ${simpleValueCount} simple values.`);
