#!/usr/bin/env node

const fs = require('fs');

const memory = fs.readFileSync(0).toString().trim().split(',').map(s => parseInt(s, 10));
let pointer = 0;

const operations = {
    1: (a, b) => a + b,
    2: (a, b) => a * b,
    99: () => false,
};

// Day 1:
memory[1] = 12;
memory[2] = 2;

while (true) {
    const op = memory[pointer++];
    const a = memory[memory[pointer++]];
    const b = memory[memory[pointer++]];
    const to = memory[pointer++];

    const result = operations[op](a, b);
    if (result === false) {
        break;
    }

    memory[to] = result;
}

console.log('Value at position 0:', memory[0]);

function memDump() {
    console.log(memory.join(','));
}
