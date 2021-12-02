import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

interface Command {
  type: string;
  amount: number;
}

interface Location {
  horizontal: number;
  depth: number;
}

const commands: Command[] = lines.map((l) => {
  const [type, amountString] = l.split(' ');
  return {
    type,
    amount: parseInt(amountString, 10),
  };
});


function applyCommand(c: Command, l: Location): Location {
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

const end = commands.reduce((acc, cur) => applyCommand(cur, acc), { horizontal: 0, depth: 0 });

console.log(`Final position: horizontal ${end.horizontal}, depth ${end.depth}`);
console.log(`Horizontal * depth: ${end.horizontal * end.depth}`);
