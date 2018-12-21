#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const SAND = '.';
const WATER_FLOW = '|';
const WATER_STALE = '~';
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

    countWater();
}

function countWater() {
    // Count the blocks of water.
    let waterCount = grid.reduce((acc, row) => acc + row.filter(block => block === WATER_FLOW || block === WATER_STALE).length, 0);
    console.log(`Blocks of water: ${waterCount}`);
}

function simulateWater(startX, startY) {
    waterDown(startX, startY);
}

function waterDown(x, y) {
    let sourceY = y;

    // Flow down.
    while (waterCanMoveTo(x, y + 1)) {
        y++;
        grid[y][x] = WATER_FLOW;
    }

    while (y >= sourceY && isFloor(x, y + 1)) {
        fillHor2(x, y);
        y--;
    }
}

function fillHor2(x, y) {
    // Find the left and right wall.
    let leftX = x;
    let rightX = x;
    while (waterCanMoveTo(leftX - 1, y) && isFloor(leftX, y + 1)) {
        leftX--;
        grid[y][leftX] = WATER_FLOW;
    }
    while (waterCanMoveTo(rightX + 1, y) && isFloor(rightX, y + 1)) {
        rightX++;
        grid[y][rightX] = WATER_FLOW;
    }

    // Check if the water should be stale.
    if (isType(leftX - 1, y, CLAY) && isFloor(leftX, y + 1) && isType(rightX + 1, y, CLAY) && isFloor(rightX, y + 1)) {
        for (let xx = leftX; xx <= rightX; xx++) {
            grid[y][xx] = WATER_STALE;
        }
    } else {
        // Check if the water should flow down.
        if (waterCanMoveTo(leftX, y + 1)) {
            waterDown(leftX, y);
        }
        if (waterCanMoveTo(rightX, y + 1)) {
            waterDown(rightX, y);
        }
    }
}

function fillHorizontal(x, y, dX) {
    // Check for a floor.
    while (isFloor(x, y + 1) && waterCanMoveTo(x + dX, y)) {
        x += dX;
        grid[y][x] = WATER_FLOW;
    }

    // Pour down.
    if (waterCanMoveTo(x, y + 1)) {
        // Pour down.
        waterDown(x, y);
        return false;
    } else {
        return true;
    }
}

function waterCanMoveTo(x, y) {
    if (y < 0 || y > bounds.y) {
        return false;
    }

    return isType(x, y, SAND);
}

function isType(x, y, type) {
    return grid[y] && grid[y][x] === type;
}

function isFloor(x, y) {
    return isType(x, y, CLAY) || isType(x, y, WATER_STALE);
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
