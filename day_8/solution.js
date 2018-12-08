#!/usr/bin/env node

const readline = require('readline');

const reader = readline.createInterface({
    input: process.stdin
});

let index = 0;
let numbers = [];
let root = {};
let metadataSum = 0;

// There is only 1 line.
reader.on('line', line => {
    numbers = line.split(' ').map(s => parseInt(s, 10));
    root = parseNode();
    getResult();
});

function getResult() {
    console.log('Sum of all metadata:', metadataSum);
}

function parseNode() {
    let node = {
        childCound: numbers[index++],
        metadataCount: numbers[index++],
        children: [],
        metadata: []
    };

    // Parse all child nodes and metadata.
    for (let c = 0; c < node.childCound; c++) {
        node.children.push(parseNode());
    }
    for (let m = 0; m < node.metadataCount; m++) {
        let val = numbers[index++]
        node.metadata.push(val);
        metadataSum += val;
    }

    return node;
}
