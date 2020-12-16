import fs from 'fs';

type Instruction = MemAssignment | MaskAssignment;

interface MemAssignment {
  type: 'mem';
  index: number;
  value: number;
}

interface MaskAssignment {
  type: 'mask';
  value: string[];
}

const input: Instruction[] = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map((line) => {
    const [left, right] = line.split(' = ');
    if (left === 'mask') {
      return { type: 'mask', value: right.split('') };
    }

    return {
      type: 'mem',
      index: parseInt(left.substring(4, left.length - 1), 10),
      value: parseInt(right, 10),
    };
  });

class Program {
  private mask: string[] = [];
  private memory: number[] = [];
  private pointer = 0;

  constructor(private readonly instructions: Instruction[]) {
  }

  public run(): void {
    while (this.pointer < this.instructions.length) {
      this.step();
    }
  }

  public step(): void {
    const instr = this.instructions[this.pointer];
    this.pointer++;

    switch (instr.type) {
      case 'mask':
        this.mask = instr.value;
        break;
      case 'mem':
        this.assignMemory(instr.index, instr.value);
        break;
    }
  }

  public sumMemory(): number {
    return this.memory.reduce((acc, cur) => acc + cur, 0);
  }

  private assignMemory(index: number, value: number) {
    const valueBin = value.toString(2);
    const valueBinPadded = `${'0'.repeat(36 - valueBin.length)}${valueBin}`;
    const valueBits = valueBinPadded.split('');

    this.mask.forEach((m, i) => {
      if (m !== 'X') {
        valueBits[i] = m;
      }
    });

    this.memory[index] = parseInt(valueBits.join(''), 2);
  }
}

const program = new Program(input);
program.run();
console.log('Sum of memory:', program.sumMemory());
