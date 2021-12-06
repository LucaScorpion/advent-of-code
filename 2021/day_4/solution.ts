import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

const drawnNumbers = lines[0].split(',').map((n) => parseInt(n, 10));

interface BoardSquare {
  value: number;
  marked: boolean;
}

type Board = BoardSquare[][];

function parseBoards(boardLines: string[]): Board[] {
  const result: Board[] = [];
  let lastBoard: Board | null = null;

  boardLines.forEach((l) => {
    if (!l) {
      if (lastBoard) {
        result.push(lastBoard);
      }

      lastBoard = null;
      return;
    }

    if (!lastBoard) {
      lastBoard = [];
    }

    lastBoard.push(
      l
        .split(' ')
        .filter((n) => n !== '')
        .map((n) => ({
          value: parseInt(n, 10),
          marked: false,
        })),
    );
  });

  if (lastBoard) {
    result.push(lastBoard);
  }

  return result;
}

function checkWin(board: Board): boolean {
  // Check if a row won.
  if (board.map((row) => row.every((col) => col.marked)).includes(true)) {
    return true;
  }

  // Check if a column won.
  if (board[0].map((_, x) => board.every((row) => row[x].marked)).includes(true)) {
    return true;
  }

  return false;
}

function boardScore(board: Board): number {
  return board.flat().map((s) => s.marked ? 0 : s.value).reduce((acc, cur) => acc + cur, 0);
}

function drawNumber(value: number): void {
  boards.forEach((b) => {
    b.forEach((row) => {
      row.forEach((col) => {
        if (col.value === value) {
          col.marked = true;
        }
      });
    });
  });
}

const boards = parseBoards(lines.slice(1));

for (const drawn of drawnNumbers) {
  drawNumber(drawn);

  const winner = boards.find(checkWin);
  if (winner) {
    console.log(`Winning score: ${boardScore(winner) * drawn}`);
    break;
  }
}
