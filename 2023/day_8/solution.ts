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


function calculateSteps(startNode: string, endNodes: string[]) {
  let currentNode = nodes.find((n) => n.self === startNode)!;
  let stepCount = 0;
  while (!endNodes.includes(currentNode.self)) {
    const stepI = stepCount % steps.length;
    const step = steps[stepI];
    const nodeStep = step === 'L' ? currentNode.left : currentNode.right;
    currentNode = nodes.find((n) => n.self === nodeStep)!;
    stepCount++;
  }
  return stepCount;
}

function calculateStepsAll(startNodes: string[], endNodes: string[]) {
  const allStepCounts = startNodes.map((n) => calculateSteps(n, endNodes));
  return leastCommonMultipleArr(allStepCounts);
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

function leastCommonMultiple(a: number, b: number) {
  return (a * b) / greatestCommonDivisor(a, b);
}

function leastCommonMultipleArr(n: number[]) {
  return n.reduce((acc, cur) => leastCommonMultiple(acc, cur), Math.min(...n));
}

console.log(`Steps taken: ${calculateSteps(
  nodes.find((n) => n.self === 'AAA')!.self,
  nodes.filter((n) => n.self === 'ZZZ').map((n) => n.self),
)}`);

console.log(`Ghost steps taken: ${calculateStepsAll(
  nodes.filter((n) => n.self.endsWith('A')).map((n) => n.self),
  nodes.filter((n) => n.self.endsWith('Z')).map((n) => n.self),
)}`);
