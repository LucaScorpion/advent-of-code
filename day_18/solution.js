#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const OPEN = '.';
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
    let newState = [];

    for (let y = 0; y < state.length; y++) {
        newState[y] = [];

        for (let x = 0; x < state[y].length; x++) {
            let adj = getAdjacent(x, y);
            let type = state[y][x];

            switch (type) {
                case OPEN:
                    if (countAdjacent(x, y, TREES) >= 3) {
                        type = TREES;
                    }
                    break;
                case TREES:
                    if (countAdjacent(x, y, LUMBERYARD) >= 3) {
                        type = LUMBERYARD;
                    }
                    break;
                case LUMBERYARD:
                    if (countAdjacent(x, y, LUMBERYARD) === 0 || countAdjacent(x, y, TREES) === 0) {
                        type = OPEN;
                    }
                    break;
            }

            newState[y][x] = type;
        }
    }

    state = newState;
}

function countAdjacent(x, y, type) {
    return getAdjacent(x, y).filter(t => t === type).length;
}

function getAdjacent(x, y) {
    let adj = [];

    for (let yy = y - 1; yy <= y + 1; yy++) {
        for (let xx = x - 1; xx <= x + 1; xx++) {
            // Check bounds.
            if (yy < 0 || yy >= state.length || xx < 0 || xx >= state[yy].length) {
                continue;
            }

            // Ignore the tile itself.
            if (xx === x && yy === y) {
                continue;
            }

            adj.push(state[yy][xx]);
        }
    }

    return adj;
}
