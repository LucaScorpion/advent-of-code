import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n').map((l) => l.split(''));

type ChunkType = '(' | '[' | '{' | '<';

interface ChunkInfo {
  closer: string;
  illegalScore: number;
  completionScore: number;
}

const chunkTypeFromCloser: Record<string, ChunkType> = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
};

const chunkInfo: Record<string, ChunkInfo> = {
  '(': {
    closer: ')',
    illegalScore: 3,
    completionScore: 1,
  },
  '[': {
    closer: ']',
    illegalScore: 57,
    completionScore: 2,
  },
  '{': {
    closer: '}',
    illegalScore: 1197,
    completionScore: 3,
  },
  '<': {
    closer: '>',
    illegalScore: 25137,
    completionScore: 4,
  },
};

interface Chunk {
  type: ChunkType;
  children: Chunk[];
}

function isChunkOpener(char: string): char is ChunkType {
  return Object.values(chunkTypeFromCloser).includes(char as ChunkType);
}

let corruptScore = 0;
const incompleteScores: number[] = [];

lines.forEach((line) => {
  const stack: ChunkType[] = [];

  for (const char of line) {
    if (isChunkOpener(char)) {
      stack.push(char);
      continue;
    }

    const type = chunkTypeFromCloser[char];
    if (type !== stack.pop()) {
      // The line is corrupt.
      corruptScore += chunkInfo[type].illegalScore;
      return;
    }
  }

  if (stack.length > 0) {
    // The line is incomplete.
    incompleteScores.push(
      stack
        .reverse()
        .map((c) => chunkInfo[c].completionScore)
        .reduce((acc, cur) => acc * 5 + cur, 0),
    );
  }
});

incompleteScores.sort((a, b) => a - b);
const middleScore = incompleteScores[(incompleteScores.length - 1) / 2];

console.log(`Syntax error score: ${corruptScore}`);
console.log(`Middle completion score: ${middleScore}`);
