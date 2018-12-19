#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const GROUND = '.';
const TREES = '|';
const LUMBERYARD = '#';

let state = [];

process.stdin.on('end', getResult);
reader.on('line', line => state.push(line.split('')));

function getResult() {
    for (let i = 1; i <= 10; i++) {
        step();
    }

    // Count the trees and lumberyards.
    let trees = 0;
    let lumberyards = 0;
    state.forEach(row => {
        row.forEach(c => {
            if (c === TREES) {
                trees++;
            } else if (c === LUMBERYARD) {
                lumberyards++;
            }
        });
    });

    console.log(`Trees * lumberyards = ${trees * lumberyards}`);
}

function step() {

}
