#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const claimRegex = /^#\d+ @ (\d+),(\d+): (\d+)x(\d+)$/;

let fabric = {
    claimedPieces: 0,
    // x -> y -> claimed by count
    pieces: []
};

process.stdin.on('end', () => {
    console.log('Claimed pieces:', fabric.claimedPieces);
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
    if (!fabric.pieces[x]) {
        fabric.pieces[x] = [];
    }

    // Apply the claim.
    let oldClaim = fabric.pieces[x][y] || 0;
    fabric.pieces[x][y] = oldClaim + 1;

    // Check if this is a new claim.
    if (oldClaim === 0) {
        fabric.claimedPieces++;
    }
}
