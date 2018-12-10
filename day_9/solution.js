#!/usr/bin/env node

Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
};

Array.prototype.removeAt = function(index) {
    this.splice(index, 1);
};

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const regex = /^(\d+) players; last marble is worth (\d+) points$/;

let playerCount;
let lastPoints;

let points = [];
let currentPlayer = -1;

let marble = 0;
let marbles = [0];
let currentMarbleI = 0;

// There is only 1 line.
reader.on('line', line => {
    let groups = regex.exec(line);
    playerCount = groups[1];
    lastPoints = groups[2];

    for (let i = 0; i < playerCount; i++) {
        points[i] = 0;
    }

    while (marble < lastPoints) {
        step();
    }

    console.log('Winning score:', Math.max(...points));
});

function step() {
    // Next player.
    currentPlayer++;
    currentPlayer %= playerCount;
    marble++;

    if (marble % 23 === 0) {
        points[currentPlayer] += marble;

        // Wrap around.
        currentMarbleI -= 7;
        while (currentMarbleI < 0) {
            currentMarbleI += marbles.length;
        }

        points[currentPlayer] += marbles[currentMarbleI];
        marbles.removeAt(currentMarbleI);
    } else {
        // Insert the marble.
        currentMarbleI = newMarbleIndex();
        marbles.insert(currentMarbleI, marble);
    }
}

function newMarbleIndex() {
    let newI = (currentMarbleI + 2) % marbles.length;
    return newI === 0 ? marbles.length : newI;
}
