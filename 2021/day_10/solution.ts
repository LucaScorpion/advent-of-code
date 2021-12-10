import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n').map((l) => l.split(''));

type ChunkType = '(' | '[' | '{' | '<';

const chunkPairs: Record<ChunkType, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const chunkPairsReverse: Record<string, ChunkType> = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
};

const illegalScore: Record<string, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

interface Chunk {
  type: ChunkType;
  children: Chunk[];
}

function isChunkOpener(char: string): char is ChunkType {
  return Object.keys(chunkPairs).includes(char);
}

let corruptScore = 0;

lines.forEach((line) => {
  const stack: ChunkType[] = [];

  for (const char of line) {
    if (isChunkOpener(char)) {
      stack.push(char);
      continue;
    }

    if (chunkPairsReverse[char] !== stack.pop()) {
      // The line is corrupt.
      corruptScore += illegalScore[char];
      break;
    }
  }
});

console.log(`Syntax error score: ${corruptScore}`);
