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

let gridBounds = {
    min: {
        x: null,
        y: null
    },
    max: {
        x: null,
        y: null
    }
};
let grid = [];

process.stdin.on('end', getResult);
reader.on('line', processLine);

function getResult() {
    // Fill the grid.
    for (let y = 0; y <= gridBounds.max.y; y++) {
        if (!grid[y]) {
            grid[y] = [];
        }

        let row = grid[y];
        for (let x = gridBounds.min.x - 1; x <= gridBounds.max.x + 1; x++) {
            if (!row[x]) {
                row[x] = SAND;
            }
        }
    }

    // Place the source.
    if (!grid[0]) {
        grid[0] = [];
    }
    grid[0][500] = SOURCE;

    simulateWater(500, 0);
    countWater();
}

function countWater() {
    // Count the blocks of water.
    let flowWaterCount = 0;
    let staleWaterCount = 0;

    for (let y = gridBounds.min.y; y <= gridBounds.max.y; y++) {
        flowWaterCount += grid[y].filter(block => block === WATER_FLOW).length;
        staleWaterCount += grid[y].filter(block => block === WATER_STALE).length;
    }

    console.log(`Total blocks of water: ${flowWaterCount + staleWaterCount}`);
    console.log(`Stale blocks of water: ${staleWaterCount}`);
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

    while (sourceY < y && isFloor(x, y + 1)) {
        fillHorizontal(x, y);
        y--;
    }
}

function fillHorizontal(x, y) {
    // Find the left and right wall.
    let leftX = x;
    let rightX = x;
    while (waterCanMoveTo(leftX - 1, y) && isFloor(leftX, y + 1)) {
        leftX--;
        grid[y][leftX] = WATER_FLOW;

        if (waterCanMoveTo(leftX, y + 1)) {
            waterDown(leftX, y);
        }
    }
    while (waterCanMoveTo(rightX + 1, y) && isFloor(rightX, y + 1)) {
        rightX++;
        grid[y][rightX] = WATER_FLOW;

        if (waterCanMoveTo(rightX, y + 1)) {
            waterDown(rightX, y);
        }
    }

    // Check if the water should be stale.
    if (isType(leftX - 1, y, CLAY) && isFloor(leftX, y + 1) && isType(rightX + 1, y, CLAY) && isFloor(rightX, y + 1)) {
        for (let xx = leftX; xx <= rightX; xx++) {
            grid[y][xx] = WATER_STALE;
        }
    }
}

function waterCanMoveTo(x, y) {
    if (y < 0 || y > gridBounds.max.y) {
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

    calcGridBounds(minX, maxX, y, y);
}

function verticalClay(x, minY, maxY) {
    for (let y = minY; y <= maxY; y++) {
        addClay(x, y);
    }

    calcGridBounds(x, x, minY, maxY);
}

function addClay(x, y) {
    if (!grid[y]) {
        grid[y] = [];
    }

    grid[y][x] = CLAY;
}

function calcGridBounds(minX, maxX, minY, maxY) {
    // X
    if (gridBounds.min.x === null || minX < gridBounds.min.x) {
        gridBounds.min.x = minX;
    }
    if (gridBounds.max.x === null || maxX > gridBounds.max.x) {
        gridBounds.max.x = maxX;
    }

    // Y
    if (gridBounds.min.y === null || minY < gridBounds.min.y) {
        gridBounds.min.y = minY;
    }
    if (gridBounds.max.y === null || maxY > gridBounds.max.y) {
        gridBounds.max.y = maxY;
    }
}
