import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);

interface Instruction {
  operation: string;
  argument: number;
}

class Computer {
  public accumulator = 0;
  public pointer = 0;

  private readonly ops: { [op: string]: (arg: number) => void } = {
    'acc': (arg: number) => {
      this.accumulator += arg;
      this.pointer++;
    },
    'jmp': (arg: number) => {
      this.pointer += arg;
    },
    'nop': () => this.pointer++,
  };

  constructor(public readonly instructions: Instruction[]) {
  }

  public step(): void {
    const instruction = this.instructions[this.pointer];
    const op = this.ops[instruction.operation];
    op(instruction.argument);
  }
}

const parsedInstructions = input.map<Instruction>((line) => {
  const [operation, argString] = line.split(' ');
  return {
    operation,
    argument: parseInt(argString, 10),
  };
});

function findLoop(computer: Computer): boolean {
  const executedInstructions = new Set<number>();
  while (computer.pointer < computer.instructions.length) {
    if (executedInstructions.has(computer.pointer)) {
      return true;
    }

    executedInstructions.add(computer.pointer);
    computer.step();
  }

  return false;
}

const part1Computer = new Computer(parsedInstructions);
findLoop(part1Computer);
console.log('Part 1 accumulator:', part1Computer.accumulator);

for (let i = 0; i < parsedInstructions.length; i++) {
  const instruction = parsedInstructions[i];

  if (instruction.operation === 'jmp' || instruction.operation === 'nop') {
    const mutatedInstruction = [...parsedInstructions];
    mutatedInstruction[i] = {
      operation: instruction.operation === 'jmp' ? 'nop' : 'jmp',
      argument: instruction.argument,
    };

    const mutatedComputer = new Computer(mutatedInstruction);
    if (!findLoop(mutatedComputer)) {
      console.log('Part 2 accumulator:', mutatedComputer.accumulator);
      break;
    }
  }
}
