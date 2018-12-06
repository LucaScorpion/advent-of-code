#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const coordRegex = /^(\d+), (\d+)$/;

let bounds = {};
let coords = [];

process.stdin.on('end', getResult);
reader.on('line', processLine);

function processLine(line) {
    let groups = coordRegex.exec(line);
    let coord = {
        x: parseInt(groups[1], 10),
        y: parseInt(groups[2], 10)
    };
    coords.push(coord);

    // Calculate the bounds.
    if (!('left' in bounds) || coord.x < bounds.left) {
        bounds.left = coord.x;
    }
    if (!('right' in bounds) || coord.x > bounds.right) {
        bounds.right = coord.x;
    }
    if (!('top' in bounds) || coord.y < bounds.top) {
        bounds.top = coord.y;
    }
    if (!('bottom' in bounds) || coord.y > bounds.bottom) {
        bounds.bottom = coord.y;
    }
}

function getResult() {
    console.log(bounds);
}
