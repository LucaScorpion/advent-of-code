#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const claimRegex = /^#\d+ @ (\d+),(\d+): (\d+)x(\d+)$/;

let fabric = [];

process.stdin.on('end', () => {
    let claimedPieces = fabric
        .map(col => col ? col.reduce((acc, val) => acc + (val > 1 ? 1 : 0), 0) : 0)
        .reduce((acc, val) => acc + val, 0);

    console.log('Claimed pieces:', claimedPieces);
});
reader.on('line', processLine);

function processLine(line) {
    const groups = claimRegex.exec(line);
    const claim = {
        left: parseInt(groups[1], 10),
        top: parseInt(groups[2], 10),
        width: parseInt(groups[3], 10),
        height: parseInt(groups[4], 10)
    };

    claimFabric(claim);
}

function claimFabric(claim) {
    // CLAIM EVERY INCH!!!
    for (let x = claim.left; x < claim.left + claim.width; x++) {
        for (let y = claim.top; y < claim.top + claim.height; y++) {
            claimInch(x, y);
        }
    }
}

function claimInch(x, y) {
    if (!fabric[x]) {
        fabric[x] = [];
    }

    // Apply the claim.
    fabric[x][y] = (fabric[x][y] || 0) + 1;
}
