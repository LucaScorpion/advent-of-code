#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const SAND = '.';
const WATER = '~';
const CLAY = '#';
const SOURCE = '+';

let bounds = {
    x: null,
    y: null
};
let grid = [];

process.stdin.on('end', getResult);
reader.on('line', processLine);

function getResult() {
    // Fill the grid.
    for (let y = 0; y <= bounds.y; y++) {
        if (!grid[y]) {
            grid[y] = [];
        }

        let row = grid[y];
        for (let x = 0; x <= bounds.x; x++) {
            if (!row[x]) {
                row[x] = SAND;
            }
        }
    }

    // Place the source.
    grid[0][10] = SOURCE;

    simulateWater(10, 0);

    grid.forEach(row => console.log(row.join('')));

    // Count the blocks of water.
    let waterCount = grid.reduce((acc, row) => acc + row.filter(block => block === WATER).length, 0);
    console.log(`Blocks of water: ${waterCount}`);
}

function simulateWater(startX, startY) {
    waterDown(startX, startY);
}

function waterDown(x, y) {
    while (waterCanMoveTo(x, y + 1)) {
        y++;
        grid[y][x] = WATER;
    }
}

function waterCanMoveTo(x, y) {
    if (y < 0 || y > bounds.y) {
        return false;
    }

    return grid[y][x] === SAND;
}

function processLine(line) {
    let parts = line.split(', ');

    let staticPart = parseInt(parts[0].substr(2), 10);
    let range = parts[1].substr(2);
    let rangeParts = range.split('..');

    let clayFunc = line.substr(0, 1) === 'x' ? verticalClay : horizontalClay;
    clayFunc(staticPart, parseInt(rangeParts[0], 10), parseInt(rangeParts[1], 10));
}

function horizontalClay(y, minX, maxX) {
    for (let x = minX; x <= maxX; x++) {
        addClay(x, y);
    }

    calcGridBounds(maxX, y);
}

function verticalClay(x, minY, maxY) {
    for (let y = minY; y <= maxY; y++) {
        addClay(x, y);
    }

    calcGridBounds(x, maxY);
}

function addClay(x, y) {
    if (!grid[y]) {
        grid[y] = [];
    }

    grid[y][x] = CLAY;
}

function calcGridBounds(x, y) {
    if (bounds.x === null || x > bounds.x) {
        bounds.x = x;
    }
    if (bounds.y === null || y > bounds.y) {
        bounds.y = y;
    }
}
