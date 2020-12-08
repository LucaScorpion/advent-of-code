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

  constructor(private readonly instructions: Instruction[]) {
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

const executedInstructions = new Set<number>();
const computer = new Computer(parsedInstructions);

while (true) {
  if (executedInstructions.has(computer.pointer)) {
    console.log('Pointer:', computer.pointer, 'Accumulator:', computer.accumulator);
    break;
  }

  executedInstructions.add(computer.pointer);
  computer.step();
}
