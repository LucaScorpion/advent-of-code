#!/usr/bin/env node

const readline = require('readline');
const Circle = require('./circle');

const reader = readline.createInterface({
    input: process.stdin
});

const regex = /^(\d+) players; last marble is worth (\d+) points$/;
let playerCount;

let lastPoints;
let points = [];

let currentPlayer = -1;

let marble = 0;
let circle = new Circle(0);

let currentNode = circle.first;

// There is only 1 line.
reader.on('line', line => {
    let groups = regex.exec(line);
    playerCount = groups[1];
    lastPoints = groups[2];

    // Initialize the points to 0.
    for (let i = 0; i < playerCount; i++) {
        points[i] = 0;
    }

    while (marble < lastPoints) {
        step();
    }

    console.log('Winning score:', Math.max(...points));
});

function step() {
    // Next player and marble.
    currentPlayer++;
    currentPlayer %= playerCount;
    marble++;

    if (marble % 23 === 0) {
        points[currentPlayer] += marble;

        let toRemove = currentNode;
        for (let i = 0; i < 7; i++) {
            toRemove = toRemove.prev;
        }
        points[currentPlayer] += toRemove.value;
        currentNode = toRemove.next;
        circle.destroy(toRemove);
    } else {
        // Insert the marble.
        currentNode = circle.insertAfter(currentNode.next, marble);
    }
}
