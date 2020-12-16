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

function toBinary36(value: number): string {
  const valueBin = value.toString(2);
  return `${'0'.repeat(36 - valueBin.length)}${valueBin}`;
}

abstract class BaseProgram {
  protected mask: string[] = [];
  protected readonly memory: Record<number, number> = {};
  private pointer = 0;

  constructor(private readonly instructions: Instruction[]) {
  }

  public run(): void {
    while (this.pointer < this.instructions.length) {
      this.step();
    }
  }

  public sumMemory(): number {
    return Object.values(this.memory).reduce((acc, cur) => acc + cur, 0);
  }

  protected abstract assignMemory(index: number, value: number): void;

  private step(): void {
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
}

class ProgramV1 extends BaseProgram {
  protected assignMemory(index: number, value: number): void {
    const valueBits = toBinary36(value).split('');

    this.mask.forEach((m, i) => {
      if (m !== 'X') {
        valueBits[i] = m;
      }
    });

    this.memory[index] = parseInt(valueBits.join(''), 2);
  }
}

class ProgramV2 extends BaseProgram {
  protected assignMemory(index: number, value: number): void {
    const indexBits = toBinary36(index).split('');
    const maskedIndexBits: string[] = [];

    this.mask.forEach((m, i) => {
      if (m === '0') {
        maskedIndexBits[i] = indexBits[i];
      } else {
        maskedIndexBits[i] = m;
      }
    });

    this.assignAllMemory(maskedIndexBits, value);
  }

  private assignAllMemory(indexBits: string[], value: number): void {
    for (let i = 0; i < 36; i++) {
      if (indexBits[i] === 'X') {
        const zero = [...indexBits];
        zero[i] = '0';
        const one = [...indexBits];
        one[i] = '1';
        this.assignAllMemory(zero, value);
        this.assignAllMemory(one, value);
        return;
      }
    }

    const index = parseInt(indexBits.join(''), 2);
    this.memory[index] = value;
  }
}

const program = new ProgramV1(input);
program.run();
console.log('Sum of memory 1:', program.sumMemory());

const program2 = new ProgramV2(input);
program2.run();
console.log('Sum of memory 2:', program2.sumMemory());
