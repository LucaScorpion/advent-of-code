#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const regex = /^position=< ?(-?\d+), *(-?\d+)> velocity=< ?(-?\d+), *(-?\d+)>$/;

let items = [];
let bounds = {};
let seconds = 0;

process.stdin.on('end', getResult);
reader.on('line', processLine);

function processLine(line) {
    let groups = regex.exec(line);
    let item = {
        pos: {
            x: parseInt(groups[1], 10),
            y: parseInt(groups[2], 10)
        },
        vel: {
            x: parseInt(groups[3], 10),
            y: parseInt(groups[4], 10)
        }
    };
    items.push(item);
}

function getResult() {
    getBounds();

    let minSurface;

    while(true) {
        step();

        let surface = (bounds.right - bounds.left) * (bounds.bottom - bounds.top);

        if (!minSurface || surface < minSurface) {
            minSurface = surface;
        } else if (surface > minSurface) {
            step(-1);
            output();
            console.log(`\nMessage took ${seconds} seconds to appear.`);
            return;
        }
    }
}

function step(amount = 1) {
    seconds += amount;

    items.forEach(item => {
        item.pos.x += item.vel.x * amount;
        item.pos.y += item.vel.y * amount;
    });

    getBounds();
}

function output() {
    let lines = [];
    let offsetX = bounds.left;
    let offsetY = bounds.top;

    items.forEach(item => {
        let y = item.pos.y - offsetY;
        if (!lines[y]) {
            lines[y] = [];
        }
        let x = item.pos.x - offsetX;

        // Fill in with spaces.
        for (let i = lines[y].length; i < x; i++) {
            lines[y][i] = ' ';
        }

        lines[y][x] = '#';
    });

    console.log(lines.map(line => line.join('')).join('\n'));
}

function getBounds() {
    let newBounds = {};

    items.forEach(item => {
        let coord = item.pos;

        // Calculate the bounds.
        if (!('left' in newBounds) || coord.x < newBounds.left) {
            newBounds.left = coord.x;
        }
        if (!('right' in newBounds) || coord.x > newBounds.right) {
            newBounds.right = coord.x;
        }
        if (!('top' in newBounds) || coord.y < newBounds.top) {
            newBounds.top = coord.y;
        }
        if (!('bottom' in newBounds) || coord.y > newBounds.bottom) {
            newBounds.bottom = coord.y;
        }
    });

    bounds = newBounds;
}
