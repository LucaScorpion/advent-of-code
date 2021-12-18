import fs from 'fs';

const input: SfNumber[] = fs.readFileSync(0).toString().trim().split('\n').map((l) => JSON.parse(l));
const EXPLODE_DEPTH = 4;
const SPLIT_VALUE = 10;

type SfNumber = number | [SfNumber, SfNumber];

abstract class SfNode {
  public parent?: SfPair;

  public abstract getValueLeft(): SfValue;

  public abstract getValueRight(): SfValue;

  public abstract magnitude(): number;

  public depth(): number {
    let result = 0;
    let p = this.parent;

    while (p) {
      p = p.parent;
      result++;
    }

    return result;
  }

  public findNeighborValueLeft(): SfValue | null {
    if (!this.parent) {
      return null;
    }

    if (this.parent.left === this) {
      return this.parent.findNeighborValueLeft();
    }

    return this.parent.left.getValueRight();
  }

  public findNeighborValueRight(): SfValue | null {
    if (!this.parent) {
      return null;
    }

    if (this.parent.right === this) {
      return this.parent.findNeighborValueRight();
    }

    return this.parent.right.getValueLeft();
  }

  public replace(newNode: SfNode): void {
    if (!this.parent) {
      throw new Error('Cannot replace node with no parent.');
    }

    newNode.parent = this.parent;
    if (this.parent.left === this) {
      this.parent.left = newNode;
    } else {
      this.parent.right = newNode;
    }
  }
}

class SfValue extends SfNode {
  public constructor(public value: number) {
    super();
  }

  public toString(): string {
    return this.value.toString();
  }


  public getValueLeft(): SfValue {
    return this;
  }

  public getValueRight(): SfValue {
    return this;
  }

  public magnitude(): number {
    return this.value;
  }
}

class SfPair extends SfNode {
  public constructor(public left: SfNode, public right: SfNode) {
    super();
    this.left.parent = this;
    this.right.parent = this;
  }

  public toString(): string {
    return `[${this.left.toString()},${this.right.toString()}]`;
  }

  public isRegular(): boolean {
    return this.left instanceof SfValue && this.right instanceof SfValue;
  }

  public getValueLeft(): SfValue {
    return this.left.getValueLeft();
  }

  public getValueRight(): SfValue {
    return this.right.getValueRight();
  }

  public magnitude(): number {
    return 3 * this.left.magnitude() + 2 * this.right.magnitude();
  }
}

function parseNode(value: SfNumber): SfNode {
  if (typeof value === 'number') {
    return new SfValue(value);
  } else {
    return new SfPair(parseNode(value[0]), parseNode(value[1]));
  }
}

function add(left: SfNode, right: SfNode): SfNode {
  const result = new SfPair(left, right);

  while (reduce(result)) {
    // Keep reducing until there's nothing left to reduce.
  }

  return result;
}

function reduce(node: SfNode): boolean {
  return checkExplode(node) || checkSplit(node);
}

function checkExplode(node: SfNode): boolean {
  if (node instanceof SfValue) {
    return false;
  }

  if (node instanceof SfPair) {
    // Node is a pair.
    // Only regular pairs (with 2 number values) can explode.
    if (node.isRegular() && node.depth() >= EXPLODE_DEPTH) {
      explode(node);
      return true;
    }

    return checkExplode(node.left) || checkExplode(node.right);
  }

  throw new Error('Unknown node type.');
}

function explode(node: SfPair): void {
  if (!node.isRegular()) {
    throw new Error('Can only explode regular pair nodes.');
  }

  const leftNeighbor = node.findNeighborValueLeft();
  if (leftNeighbor) {
    leftNeighbor.value += (node.left as SfValue).value;
  }

  const rightNeighbor = node.findNeighborValueRight();
  if (rightNeighbor) {
    rightNeighbor.value += (node.right as SfValue).value;
  }

  node.replace(new SfValue(0));
}

function checkSplit(node: SfNode): boolean {
  if (node instanceof SfValue) {
    if (node.value >= SPLIT_VALUE) {
      node.replace(new SfPair(
        new SfValue(Math.floor(node.value / 2)),
        new SfValue(Math.ceil(node.value / 2)),
      ));
      return true;
    }
    return false;
  }

  if (node instanceof SfPair) {
    return checkSplit(node.left) || checkSplit(node.right);
  }

  throw new Error('Unknown node type.');
}

let rootNode = parseNode(input[0]);
for (let i = 1; i < input.length; i++) {
  rootNode = add(rootNode, parseNode(input[i]));
}

console.log(`Total magnitude: ${rootNode.magnitude()}`);

let maxMagnitude = 0;
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input.length; j++) {
    if (i === j) {
      continue;
    }

    const checkMagnitude = add(parseNode(input[i]), parseNode(input[j])).magnitude();
    maxMagnitude = Math.max(maxMagnitude, checkMagnitude);
  }
}

console.log(`Maximum magnitude: ${maxMagnitude}`);
