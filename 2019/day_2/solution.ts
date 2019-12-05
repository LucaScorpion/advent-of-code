#!/usr/bin/env ts-node

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

  public compute(): number {
    while (true) {
      const op = this.memory[this.pointer++];
      const result = this.operations[op]();

      // Check for halting.
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

const day1 = new IntCodeComputer(input, 12, 2);
console.log('Test run result:', day1.compute());
