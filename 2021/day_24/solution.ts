import fs from 'fs';

const input: Instruction[] = fs.readFileSync(0).toString().trim().split('\n').map((l) => {
  const [operation, a, b] = l.split(' ');

  let bVal: string | number = b;
  const bNum = Number(b);
  if (!isNaN(bNum)) {
    bVal = bNum;
  }

  return {
    operation,
    a: a as RegistryKey,
    b: bVal as Value,
  };
});
const MODEL_NUM_LENGTH = 14;

interface Instruction {
  operation: string;
  a: RegistryKey;
  b: Value;
}

interface Registry {
  w: number;
  x: number;
  y: number;
  z: number;
}

type RegistryKey = keyof Registry;

type Value = RegistryKey | number;

class Alu {
  private reg: Registry = {
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  };

  private inputString = '';
  private inputPointer = 0;

  public constructor(private readonly instructions: Instruction[]) {
  }

  public run(input: string | number): Registry {
    this.reset();
    this.inputString = input.toString();

    this.instructions.forEach((i) => {
      // @ts-ignore
      this[i.operation](i.a, i.b);
    });

    return { ...this.reg };
  }

  private reset(): void {
    this.inputPointer = 0;
    this.reg = {
      w: 0,
      x: 0,
      y: 0,
      z: 0,
    };
  }

  private getNumValue(val: Value): number {
    if (typeof val === 'number') {
      return val;
    }
    return this.reg[val];
  }

  private getInput(): number {
    return Number(this.inputString[this.inputPointer++]);
  }

  private inp(a: RegistryKey): void {
    this.reg[a] = this.getInput();
  }

  private add(a: RegistryKey, b: Value): void {
    this.reg[a] = this.reg[a] + this.getNumValue(b);
  }

  private mul(a: RegistryKey, b: Value): void {
    this.reg[a] = this.reg[a] * this.getNumValue(b);
  }

  private div(a: RegistryKey, b: Value): void {
    this.reg[a] = Math.trunc(this.reg[a] / this.getNumValue(b));
  }

  private mod(a: RegistryKey, b: Value): void {
    this.reg[a] = this.reg[a] % this.getNumValue(b);
  }

  private eql(a: RegistryKey, b: Value): void {
    this.reg[a] = this.reg[a] === this.getNumValue(b) ? 1 : 0;
  }
}

const alu = new Alu(input);
let maxModelNum = Number('9'.repeat(MODEL_NUM_LENGTH));
let valid = false;

function validateModelNum(): void {
  const reg = alu.run(maxModelNum);
  valid = reg.z === 0;
}

function decreaseModelNum(): void {
  maxModelNum--;
  while (maxModelNum.toString().includes('0')) {
    maxModelNum--;
  }
}

validateModelNum();
while (!valid) {
  decreaseModelNum();
  validateModelNum();
}

console.log(maxModelNum);
