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

function createGraph(grid: number[][]): Node[] {
  const graph: Node[] = [];

  // Create nodes for all grid cells.
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      graph.push({
        value: grid[y][x],
        neighbors: [],
        position: { x, y },
      });
    }
  }

  // Populate all node neighbors.
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      const node = graph.find((n) => n.position.x === x && n.position.y === y)!;

      for (let dY = -1; dY <= 1; dY++) {
        for (let dX = -1; dX <= 1; dX++) {
          if (Math.abs(dX) === Math.abs(dY)) {
            continue;
          }
          const neighbor = graph.find((n) => n.position.x === x + dX && n.position.y === y + dY);
          if (neighbor) {
            node.neighbors.push(neighbor);
          }
        }
      }
    }
  }

  return graph;
}

function findPath(graph: Node[], from: Node, target: Node): Node[] {
  const distances = new Map<Node, number>();
  const prevNodes = new Map<Node, Node>();
  let queue: Node[] = [];

  graph.forEach((n) => {
    distances.set(n, Number.POSITIVE_INFINITY);
    queue.push(n);
  });
  distances.set(from, 0);

  while (queue.length) {
    const check = queue.reduce((acc, cur) => distances.get(acc)! < distances.get(cur)! ? acc : cur);
    queue = queue.filter((n) => n !== check);

    if (check === target) {
      const path = [target];

      let prevNode = prevNodes.get(target);
      while (prevNode) {
        path.push(prevNode);
        prevNode = prevNodes.get(prevNode);
      }

      return path.reverse();
    }

    check.neighbors.forEach((neighbor) => {
      const neighborDist = distances.get(check)! + neighbor.value;
      if (neighborDist < distances.get(neighbor)!) {
        distances.set(neighbor, neighborDist);
        prevNodes.set(neighbor, check);
      }
    });
  }

  throw new Error('Could not find path.');
}

const smallGraph = createGraph(input);
const smallRisk = findPath(smallGraph, smallGraph[0], smallGraph[smallGraph.length - 1]).slice(1).reduce((acc, cur) => acc + cur.value, 0);
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
const largeRisk = findPath(largeGraph, largeGraph[0], largeGraph[largeGraph.length - 1]).slice(1).reduce((acc, cur) => acc + cur.value, 0);
console.log(`Risk on large cave: ${largeRisk}`);
