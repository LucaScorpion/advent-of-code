#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const claimRegex = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/;

// [x] -> [y] -> [claimId]
let fabric = [];
// A claim is valid if it is the only one on a square inch.
let claims = {};

process.stdin.on('end', () => {
    let claimedPieces = fabric
        .map(col => col ? col.reduce((acc, val) => acc + (val.length > 1 ? 1 : 0), 0) : 0)
        .reduce((acc, val) => acc + val, 0);

    console.log('Claimed square inches:', claimedPieces);

    let validClaims = Object.values(claims)
        .filter(c => c.valid)
        .map(c => c.id);

    console.log('Valid claim id:', validClaims.join(', '));
});
reader.on('line', processLine);

function processLine(line) {
    const groups = claimRegex.exec(line);
    const claim = {
        id: groups[1],
        left: parseInt(groups[2], 10),
        top: parseInt(groups[3], 10),
        width: parseInt(groups[4], 10),
        height: parseInt(groups[5], 10),
        valid: true
    };

    claims[claim.id] = claim;
    claimFabric(claim);
}

function claimFabric(claim) {
    // CLAIM EVERY INCH!!!
    for (let x = claim.left; x < claim.left + claim.width; x++) {
        for (let y = claim.top; y < claim.top + claim.height; y++) {
            claimInch(claim.id, x, y);
        }
    }
}

function claimInch(id, x, y) {
    if (!fabric[x]) {
        fabric[x] = [];
    }
    if (!fabric[x][y]) {
        fabric[x][y] = [];
    }

    // Apply the claim.
    if (!fabric[x][y].includes(id)) {
        fabric[x][y].push(id);
    }

    // If there is more than 1 claim, invalidate them all.
    if (fabric[x][y].length > 1) {
        fabric[x][y].forEach(i => claims[i].valid = false);
    }
}
