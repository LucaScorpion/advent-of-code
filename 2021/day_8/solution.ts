import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split('\n');

const segmentLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

interface Entry {
  patterns: string[];
  value: string[];
}

function alphabetize(value: string): string {
  return value.split('').sort().join('');
}

const entries: Entry[] = input.map((l) => {
  const [rawPatterns, rawValue] = l.split(' | ');
  const patterns = rawPatterns.split(' ').map(alphabetize);
  const value = rawValue.split(' ').map(alphabetize);
  return { patterns, value };
});

// Length of pattern string to number value.
const simpleValueMappings: Record<number, number> = {
  2: 1,
  3: 7,
  4: 4,
  7: 8,
};

let simpleValueCount = entries
  .flatMap((e) => e.value)
  .map((v) => v.length)
  .filter((l) => simpleValueMappings[l] != null)
  .length;
console.log(`Found ${simpleValueCount} simple values.`);

const numberSegments: string[][] = [
  ['a', 'b', 'c', 'e', 'f', 'g'],
  ['c', 'f'],
  ['a', 'c', 'd', 'e', 'g'],
  ['a', 'c', 'd', 'f', 'g'],
  ['b', 'c', 'd', 'f'],
  ['a', 'b', 'd', 'f', 'g'],
  ['a', 'b', 'd', 'e', 'f', 'g'],
  ['a', 'c', 'f'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  ['a', 'b', 'c', 'd', 'f', 'g'],
];

function getNumberMapping(oldNumberMapping: Record<string, number[]>, segmentMapping: Record<string, string>): Record<string, number[]> {
  return Object.fromEntries(
    Object.entries(oldNumberMapping)
      .map(([pattern, options]) => {
        const newOptions = options.filter((o) => {
          const realSegments = numberSegments[o];
          return pattern
            .split('')
            .map((l) => segmentMapping[l]) // Map the segment.
            .filter(l => !!l) // Filter out unmapped segments.
            .every((l) => realSegments.includes(l)); // Check if the segment works.
        });

        return [pattern, newOptions];
      }),
  );
}

function search(numberMapping: Record<string, number[]>, segmentMapping: Record<string, string>): Record<string, number> | undefined {
  // Check if every segment is mapped.
  if (Object.entries(segmentMapping).length === segmentLetters.length) {
    return Object.fromEntries(
      Object.entries(numberMapping).map(([p, o]) => [p, o[0]]),
    );
  }

  // Try to map all segments.
  for (const sFrom of segmentLetters) {
    // Check if we already mapped from this segment.
    if (segmentMapping[sFrom]) {
      continue;
    }

    for (const sTo of segmentLetters) {
      // Check if we already mapped to this segment.
      if (Object.values(segmentMapping).includes(sTo)) {
        continue;
      }

      // Add the segment mapping.
      const newSegmentMapping = {
        ...segmentMapping,
        [sFrom]: sTo,
      };

      // Update the possible number mappings.
      const newNumberMapping = getNumberMapping(numberMapping, newSegmentMapping);

      // Check if there are any number mappings without value.
      if (Object.values(newNumberMapping).find((v) => v.length === 0)) {
        continue;
      }

      // Check the next level.
      const next = search(newNumberMapping, newSegmentMapping);
      if (next) {
        return next;
      }
    }
  }
}

let outputSum = 0;
entries.forEach((entry) => {
  const initNumberMapping: Record<string, number[]> = {};

  // Initialize with all options.
  entry.patterns.forEach((p) => {
    numberSegments.forEach((s, i) => {
      if (s.length === p.length) {
        const opts = initNumberMapping[p] || [];
        opts.push(i);
        initNumberMapping[p] = opts;
      }
    });
  });

  const numberMapping = search(initNumberMapping, {});
  if (!numberMapping) {
    throw new Error('Could not find mapping!');
  }

  const outputString = entry.value.map((v) => numberMapping[v]).join('');
  outputSum += parseInt(outputString, 10);
});

console.log(`Sum of outputs: ${outputSum}`);
