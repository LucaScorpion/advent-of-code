#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const coordRegex = /^(\d+), (\d+)$/;

let bounds = {};
let points = [];
let safePoints = 0;

process.stdin.on('end', getResult);
reader.on('line', processLine);

function processLine(line) {
    let groups = coordRegex.exec(line);
    let coord = {
        x: parseInt(groups[1], 10),
        y: parseInt(groups[2], 10),
        infinite: false,
        size: 0
    };
    points.push(coord);

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
    // For each coordinate in the bounds...
    for (let x = bounds.left; x <= bounds.right; x++) {
        for (let y = bounds.top; y <= bounds.bottom; y++) {
            let minDist = null;
            let closestI = null;

            let totalDist = 0;

            // ...calculate the distance to each point.
            for (let i = 0; i < points.length; i++) {
                let p = points[i];
                let d = manhattanDistance({x, y}, p);

                // Check the shortest distance, check for a tie.
                if (minDist === null || d < minDist) {
                    minDist = d;
                    closestI = i;
                } else if (d === minDist) {
                    closestI = null;
                }

                totalDist += d;
            }

            if (closestI !== null) {
                // Check if the point is on the border.
                if (x === bounds.left || x === bounds.right || y === bounds.top || y === bounds.bottom) {
                    points[closestI].infinite = true;
                }

                points[closestI].size++;
            }

            if (totalDist < 10000) {
                safePoints++;
            }
        }
    }

    // Get the point with the largest area.
    let sizes = points.filter(p => !p.infinite).map(p => p.size);
    let maxSize = Math.max(...sizes);
    console.log('Largest area:', maxSize);

    // Get the amount of safe points.
    console.log('Safe points:', safePoints);
}

function manhattanDistance(from, to) {
    let dX = Math.abs(to.x - from.x);
    let dY = Math.abs(to.y - from.y);
    return dX + dY;
}
