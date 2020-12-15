import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map((line): Instruction => ({
    char: line.charAt(0),
    num: parseInt(line.slice(1), 10),
  }));

interface Instruction {
  char: string;
  num: number;
}

interface Ship {
  rotation: number; // 0 is east, 90 is south, etc
  x: number;
  y: number;
}

const direction: { [key: number]: string } = {
  0: 'E',
  90: 'S',
  180: 'W',
  270: 'N',
};

function move(ship: Ship, instruction: Instruction): Ship {
  let newState = { ...ship };
  switch (instruction.char) {
    case 'N':
      newState.y += instruction.num;
      break;
    case 'S':
      newState.y -= instruction.num;
      break;
    case 'E':
      newState.x += instruction.num;
      break;
    case 'W':
      newState.x -= instruction.num;
      break;
    case 'L':
      newState.rotation += (360 - instruction.num);
      break;
    case 'R':
      newState.rotation += instruction.num;
      break;
    case 'F':
      const directionInstruction: Instruction = {
        char: direction[ship.rotation],
        num: instruction.num,
      };
      newState = move(newState, directionInstruction);
      break;
  }

  newState.rotation %= 360;

  return newState;
}

let startingState: Ship = { rotation: 0, x: 0, y: 0 };
const finalState = input.reduce((acc, cur) => move(acc, cur), startingState);

const distance = Math.abs(finalState.x) + Math.abs(finalState.y);
console.log('Manhattan distance:', distance);
