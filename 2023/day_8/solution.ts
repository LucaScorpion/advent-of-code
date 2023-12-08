import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

interface Node {
  self: string;
  left: string;
  right: string;
}

const steps = lines[0];
const nodes: Node[] = lines.slice(2).map((l) => ({
  self: l.substring(0, 3),
  left: l.substring(7, 10),
  right: l.substring(12, 15),
}));

let currentNode = nodes.find((n) => n.self === 'AAA')!;
let stepCount = 0;
while (currentNode.self !== 'ZZZ') {
  const stepI = stepCount % steps.length;
  const step = steps[stepI];
  const nodeStep = step === 'L' ? currentNode.left : currentNode.right;
  currentNode = nodes.find((n) => n.self === nodeStep)!;
  stepCount++;
}

console.log(`Steps taken: ${stepCount}`);
