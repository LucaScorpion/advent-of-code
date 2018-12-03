#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

const claimRegex = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/;

let claims = [];
let fabric = {
    width: 0,
    height: 0,
    claimedPieces: 0,
    pieces: []
};

process.stdin.on('end', processClaims);
reader.on('line', processLine);

function processLine(line) {
    const groups = claimRegex.exec(line);
    const claim = {
        id: groups[0],
        left: groups[1],
        top: groups[2],
        width: groups[3],
        height: groups[4]
    };

    // Calculate the fabric width and height.
    const width = claim.left + claim.width;
    const height = claim.top + claim.height;
    if (width > fabric.width) {
        fabric.width = width;
    }
    if (height > fabric.height) {
        fabric.height = height;
    }

    claims.push(claim);
}

function processClaims() {
    console.log(`Fabric size: ${fabric.width}x${fabric.height} inches.`);
    claims.map(getClaimCoords).forEach(claimFabric);
    console.log('Claimed pieces:', fabric.claimedPieces);
}

function getClaimCoords(claim) {
    let coords = [];
    for (x = claim.left; x < claim.left + claim.width; x++) {
        for (y = claim.top; y < claim.top + claim.height; y++) {
            coords.push({x, y});
        }
    }
    return coords;
}

function claimFabric(coord) {
    const x = coord.x;
    const y = coord.y;

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
