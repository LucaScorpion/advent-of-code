import * as fs from 'fs';

type Direction = 'L' | 'R';

interface Rotation {
  direction: Direction;
  amount: number;
}

class Dial {
  private static readonly MAX = 100;

  private value = 50;

  public rotate(rotation: Rotation) {
    this.value += rotation.direction === 'R' ? rotation.amount : -rotation.amount;
    while (this.value < 0) {
      this.value += Dial.MAX;
    }
    this.value %= Dial.MAX;
  }

  public current(): number {
    return this.value;
  }
}

const lines = fs.readFileSync(0).toString().trim().split('\n')
  .map((l): Rotation => ({direction: l[0] as Direction, amount: parseInt(l.substring(1), 10)}));

const dial = new Dial();
let zeroes = 0;

lines.forEach((l) => {
  dial.rotate(l);
  if (dial.current() === 0) {
    zeroes++;
  }
});

console.log(`Password: ${zeroes}`);
