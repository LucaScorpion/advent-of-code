#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const SAND = '.';
const WATER = '~';
const CLAY = '#';

let yBounds = {
    min: null,
    max: null
};
let clayBlocks = [];
let grid = [];

process.stdin.on('end', getResult);
reader.on('line', processLine);

function getResult() {
    // Build the grid.


    // Place the water, process until stable.

    // Count the blocks of water.
    let waterCount = grid.reduce((acc, row) => acc + row.filter(block => block === WATER).length, 0);
    console.log(`Blocks of water: ${waterCount}`);
}

function processLine(line) {
    let parts = line.split(', ');

    let staticPart = parts[0].substr(2);
    let range = parts[1].substr(2);
    let rangeParts = range.split('..');

    let minY = 0;
    let maxY = 0;

    // Calculate the grid bounds.
    if (yBounds.min === null || minY < yBounds.min) {
        yBounds.min = minY;
    }
    if (yBounds.max === null || maxY > yBounds.max) {
        yBounds.max = maxY;
    }
}

function horizontalClay() {

}

function verticalClay() {

}
