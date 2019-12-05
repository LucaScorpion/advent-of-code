import fs from 'fs';

type Operation = () => number | false;
type OperationMap = { [op: number]: Operation };

class IntCodeComputer {
  private pointer = 0;
  private operations: OperationMap = {
    1: () => this.valueAtPointer() + this.valueAtPointer(),
    2: () => this.valueAtPointer() * this.valueAtPointer(),
    99: () => false,
  };

  public constructor(private memory: number[], noun: number, verb: number) {
    this.memory[1] = noun;
    this.memory[2] = verb;
  }

  public compute(): number | false {
    while (true) {
      const opcode = this.memory[this.pointer++];
      const op = this.operations[opcode];

      // Check if the operation is valid;
      if (!op) {
        return false;
      }

      // Check for halting.
      const result = op();
      if (result === false) {
        break;
      }

      const to = this.memory[this.pointer++];
      this.memory[to] = result;
    }
    return this.memory[0];
  }

  private valueAtPointer(): number {
    return this.memory[this.memory[this.pointer++]];
  }
}

const input = fs.readFileSync(0).toString().trim().split(',').map((s: string) => parseInt(s, 10));

const day1 = new IntCodeComputer(input.slice(), 12, 2);
console.log('Test run result:', day1.compute());

const requiredOutput = 19690720;
outer:
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      const result = new IntCodeComputer(input.slice(), noun, verb).compute();
      if (result === requiredOutput) {
        console.log('Found noun', noun, 'and verb', verb);
        console.log('Result:', 100 * noun + verb);
        break outer;
      }
    }
  }
