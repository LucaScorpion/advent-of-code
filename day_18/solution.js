#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const OPEN = '.';
const TREES = '|';
const LUMBERYARD = '#';

const TARGET_MINS = 1000000000;

let state = [];
/**
 *
 * @type {{number: [{minute: number, state: Array}]}}
 */
let scores = {};

process.stdin.on('end', getResult);
reader.on('line', line => state.push(line.split('')));

function getResult() {
    scores[calculateScore()] = {minute: 0, state};

    let prevSameState = null;
    let minute = 0;
    while (minute < TARGET_MINS && prevSameState === null) {
        step();
        minute++;
        let score = calculateScore();

        prevSameState = findState(score);

        // Store the current state.
        if (scores[score] == null) {
            scores[score] = [];
        }
        scores[score].push({minute, state});

        // Part 1.
        if (minute === 10) {
            console.log(`After 10 minutes: ${calculateScore()}`);
        }
    }

    // Fast-forward.
    if (prevSameState) {
        let oldMinute = prevSameState.minute;
        let length = minute - oldMinute;
        let minutesLeft = (TARGET_MINS - minute) % length;
        console.log(`Found pattern with length ${length} on minute ${minute}.`);

        // Fast-forward.
        minute = TARGET_MINS - minutesLeft;
        state = prevSameState.state;
    }

    // Finish it.;
    while (minute < TARGET_MINS) {
        step();
        minute++;
    }

    console.log(`After ${minute} minutes: ${calculateScore()}`);
}

function findState(score) {
    let similar = scores[score];
    if (!similar) {
        return null;
    }

    for (let i = 0; i < similar.length; i++) {
        if (statesEqual(state, similar[i].state)) {
            return similar[i];
        }
    }

    return null;
}

function statesEqual(s1, s2) {
    for (let y = 0; y < s1.length; y++) {
        for (let x = 0; x < s1[y].length; x++) {
            if (s1[y][x] !== s2[y][x]) {
                return false;
            }
        }
    }

    return true;
}

function calculateScore() {
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

    return trees * lumberyards;
}

function step() {
    let newState = [];

    for (let y = 0; y < state.length; y++) {
        newState[y] = [];

        for (let x = 0; x < state[y].length; x++) {
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
