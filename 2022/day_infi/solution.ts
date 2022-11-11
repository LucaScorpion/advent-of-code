import fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');
console.log(lines);
