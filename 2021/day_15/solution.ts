import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split('\n').map((line) => line.split('').map(Number));
const LARGE_SCALE = 5;

interface Position {
  x: number;
  y: number;
}

interface Node {
  value: number;
  neighbors: Node[];
  position: Position;
}

function addNeighbor(node: Node, neighbor?: Node): void {
  if (neighbor) {
    node.neighbors.push(neighbor);
  }
}

function createGraph(grid: number[][]): Node[] {
  const graph: Node[] = [];
  const nodesByPos: Record<string, Node> = {};

  // Create nodes for all grid cells.
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const node: Node = {
        value: grid[y][x],
        neighbors: [],
        position: { x, y },
      };
      graph.push(node);
      nodesByPos[`${x};${y}`] = node;
    }
  }

  // Populate all node neighbors.
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const node = nodesByPos[`${x};${y}`];

      addNeighbor(node, nodesByPos[`${x - 1};${y}`]);
      addNeighbor(node, nodesByPos[`${x + 1};${y}`]);
      addNeighbor(node, nodesByPos[`${x};${y - 1}`]);
      addNeighbor(node, nodesByPos[`${x};${y + 1}`]);
    }
  }

  return graph;
}

function heuristic(node: Node, gridSize: Position): number {
  return ((gridSize.x - 1) - node.position.x) + ((gridSize.y - 1) - node.position.y);
}

function findPath(graph: Node[], from: Node, target: Node, gridSize: Position): Node[] {
  const distances = new Map<Node, number>();
  const heuristics = new Map<Node, number>();
  const prevNodes = new Map<Node, Node>();
  let queue: Node[] = [from];

  graph.forEach((n) => {
    distances.set(n, Number.POSITIVE_INFINITY);
    heuristics.set(n, Number.POSITIVE_INFINITY);
  });
  distances.set(from, 0);
  heuristics.set(from, heuristic(from, gridSize));

  while (queue.length) {
    const current = queue.reduce((acc, cur) => heuristics.get(acc)! < heuristics.get(cur)! ? acc : cur);
    queue = queue.filter((n) => n !== current);

    // Check if we're at the goal.
    if (current === target) {
      const path = [target];

      // Build the path.
      let prevNode = prevNodes.get(target);
      while (prevNode) {
        path.push(prevNode);
        prevNode = prevNodes.get(prevNode);
      }

      return path.reverse();
    }

    // Check all neighbors.
    current.neighbors.forEach((neighbor) => {
      const neighborDist = distances.get(current)! + neighbor.value;
      if (neighborDist < distances.get(neighbor)!) {
        prevNodes.set(neighbor, current);
        distances.set(neighbor, neighborDist);
        heuristics.set(neighbor, neighborDist + heuristic(neighbor, gridSize));

        if (!queue.includes(neighbor)) {
          queue.push(neighbor);
        }
      }
    });
  }

  throw new Error('Could not find path.');
}

const smallGraph = createGraph(input);
const smallSize = { x: input[0].length, y: input.length };
const smallRisk = findPath(smallGraph, smallGraph[0], smallGraph[smallGraph.length - 1], smallSize)
  .slice(1).reduce((acc, cur) => acc + cur.value, 0);
console.log(`Risk on small cave: ${smallRisk}`);

const largeInput = [...input.map((r) => [...r])];
largeInput.forEach((row) => {
  let prevRow = row;
  for (let x = 0; x < LARGE_SCALE - 1; x++) {
    const newRow = prevRow.map((n) => (n % 9) + 1);
    row.push(...newRow);
    prevRow = newRow;
  }
});

const gridHeight = largeInput.length;
for (let y = 0; y < LARGE_SCALE - 1; y++) {
  for (let dY = 0; dY < gridHeight; dY++) {
    const newRow = largeInput[(y * gridHeight) + dY].map((n) => (n % 9) + 1);
    largeInput.push(newRow);
  }
}

const largeGraph = createGraph(largeInput);
const largeSize = { x: largeInput[0].length, y: largeInput.length };
const largeRisk = findPath(largeGraph, largeGraph[0], largeGraph[largeGraph.length - 1], largeSize)
  .slice(1).reduce((acc, cur) => acc + cur.value, 0);
console.log(`Risk on large cave: ${largeRisk}`);
