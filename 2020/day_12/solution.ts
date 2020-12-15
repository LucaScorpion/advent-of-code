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

const finalState1 = input.reduce((acc, cur) => move(acc, cur), { rotation: 0, x: 0, y: 0 });
console.log('Manhattan distance part 1:', Math.abs(finalState1.x) + Math.abs(finalState1.y));

// PART 2

interface ShipWithWaypoint {
  shipX: number;
  shipY: number;
  waypointX: number;
  waypointY: number;
}

function move2(state: ShipWithWaypoint, instruction: Instruction): ShipWithWaypoint {
  const newState = { ...state };
  switch (instruction.char) {
    case 'N':
      newState.waypointY += instruction.num;
      break;
    case 'S':
      newState.waypointY -= instruction.num;
      break;
    case 'E':
      newState.waypointX += instruction.num;
      break;
    case 'W':
      newState.waypointX -= instruction.num;
      break;
    case 'L':
      for (let rot = instruction.num; rot > 0; rot -= 90) {
        const newX = -newState.waypointY;
        newState.waypointY = newState.waypointX;
        newState.waypointX = newX;
      }
      break;
    case 'R':
      for (let rot = instruction.num; rot > 0; rot -= 90) {
        const newY = -newState.waypointX;
        newState.waypointX = newState.waypointY;
        newState.waypointY = newY;
      }
      break;
    case 'F':
      for (let i = 0; i < instruction.num; i++) {
        newState.shipX += newState.waypointX;
        newState.shipY += newState.waypointY;
      }
      break;
  }

  return newState;
}

const finalState2 = input.reduce(
  (acc, cur) => move2(acc, cur),
  { shipX: 0, shipY: 0, waypointX: 10, waypointY: 1 },
);
console.log('Manhattan distance part 2:', Math.abs(finalState2.shipX) + Math.abs(finalState2.shipY));
