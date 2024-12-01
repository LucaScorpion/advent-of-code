import * as fs from 'fs';

const leftList: number[] = [];
const rightList: number[] = [];

fs.readFileSync(0).toString().trim().split('\n')
    .forEach((line) => {
        const [left, right] = line.split(' ').filter(x => !!x);
        leftList.push(parseInt(left, 10));
        rightList.push(parseInt(right, 10));
    });

leftList.sort((a, b) => a - b);
rightList.sort((a, b) => a - b);

const distances = leftList.map((v, i) => Math.abs(v - rightList[i]));
const totalDistance = distances.reduce((acc, v) => acc + v, 0);

console.log(`Total distance between lists: ${totalDistance}`);

const similarities = leftList.map((v) => {
    const rightAmount = rightList.filter((r) => r === v).length;
    return v * rightAmount;
});

const totalSimilarity = similarities.reduce((acc, v) => acc + v, 0);

console.log(`Total similarity between lists: ${totalSimilarity}`);
