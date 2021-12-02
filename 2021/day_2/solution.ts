import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

interface Command {
  type: string;
  amount: number;
}

interface Location {
  horizontal: number;
  depth: number;
  aim: number;
}

const commands: Command[] = lines.map((l) => {
  const [type, amountString] = l.split(' ');
  return {
    type,
    amount: parseInt(amountString, 10),
  };
});


function applyCommandOne(c: Command, l: Location): Location {
  const newLocation = { ...l };

  switch (c.type) {
    case 'forward':
      newLocation.horizontal += c.amount;
      break;
    case 'down':
      newLocation.depth += c.amount;
      break;
    case 'up':
      newLocation.depth -= c.amount;
      break;
    default:
      throw new Error(`Unknown command type: ${c.type}`);
  }

  return newLocation;
}

const end = commands.reduce((acc, cur) => applyCommandOne(cur, acc), { horizontal: 0, depth: 0, aim: 0 });

console.log(`Final position: horizontal ${end.horizontal}, depth ${end.depth}`);
console.log(`Horizontal * depth: ${end.horizontal * end.depth}`);

// Part 2

function applyCommandTwo(c: Command, l: Location): Location {
  const newLocation = { ...l };

  switch (c.type) {
    case 'forward':
      newLocation.horizontal += c.amount;
      newLocation.depth += c.amount * newLocation.aim;
      break;
    case 'down':
      newLocation.aim += c.amount;
      break;
    case 'up':
      newLocation.aim -= c.amount;
      break;
    default:
      throw new Error(`Unknown command type: ${c.type}`);
  }

  return newLocation;
}

const end2 = commands.reduce((acc, cur) => applyCommandTwo(cur, acc), { horizontal: 0, depth: 0, aim: 0 });

console.log('With aim:');
console.log(`Final position: horizontal ${end2.horizontal}, depth ${end2.depth}`);
console.log(`Horizontal * depth: ${end2.horizontal * end2.depth}`);
