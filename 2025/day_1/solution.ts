import * as fs from 'fs';

type Direction = 'L' | 'R';

interface Rotation {
  direction: Direction;
  amount: number;
}

class Dial {
  private static readonly MAX = 100;

  private value = 50;
  private zeroes = 0;

  public rotate(rotation: Rotation) {
    const unit = rotation.direction === 'R' ? 1 : -1;
    for (let i = 0; i < rotation.amount; i++) {
      this.value += unit;

      while (this.value < 0) {
        this.value += Dial.MAX;
      }
      this.value %= Dial.MAX;

      if (this.value === 0) {
        this.zeroes++;
      }
    }
  }

  public current(): number {
    return this.value;
  }

  public getZeroes(): number {
    return this.zeroes;
  }
}

const lines = fs.readFileSync(0).toString().trim().split('\n')
  .map((l): Rotation => ({direction: l[0] as Direction, amount: parseInt(l.substring(1), 10)}));

const dial = new Dial();
let endZeroes = 0;

lines.forEach((l) => {
  dial.rotate(l);

  if (dial.current() === 0) {
    endZeroes++;
  }
});

console.log(`Password: ${endZeroes}`);
console.log(`Password using 0x434C49434B: ${dial.getZeroes()}`);
