import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);

type TreeNode = number | Expression;

interface Expression {
  operator: string;
  left: TreeNode;
  right: TreeNode;
}

function findClosingParen(chars: string[]): number {
  let depth = 1;
  let i = 0;

  while (depth > 0) {
    i++;
    if (chars[i] === '(') {
      depth++;
    } else if (chars[i] === ')') {
      depth--;
    }
  }

  return i;
}

function parseTreeNode(chars: string[]): [TreeNode, number] {
  const parsedNumber = parseInt(chars[0], 10);
  if (!isNaN(parsedNumber)) {
    return [parsedNumber, 1];
  }

  // chars[0] === '('
  const subTreeChars = chars.slice(1, findClosingParen(chars));
  const [node, i] = parseTreeNode(subTreeChars);
  return [node, i + 1];
}

function parseTree(chars: string[]): TreeNode {
  if (chars.length === 1) {
    return parseInt(chars[0], 10);
  }

  const [leftNode, operatorIndex] = parseTreeNode(chars);
  const operator = chars[operatorIndex];
  const [rightNode, restStart] = parseTreeNode(chars.slice(operatorIndex + 1));

  let actualRightNode = rightNode;
  const realRestStart = restStart + operatorIndex + 1;

  if (realRestStart < chars.length) {
    const restOperator = chars[realRestStart];
    const restChars = chars.slice(realRestStart + 1);
    const restTree = parseTree(restChars);

    actualRightNode = {
      left: rightNode,
      operator: restOperator,
      right: restTree,
    };
  }

  return {
    left: leftNode,
    operator,
    right: actualRightNode,
  };
}

function evaluate(expression: string): number {
  const chars = expression.replace(/ /g, '').split('');
  const tree = parseTree(chars);

  console.log(JSON.stringify(tree, null, 2));

  // TODO: evaluate tree.
  return 0;
}

const total = input.map(evaluate).reduce((acc, cur) => acc + cur, 0);
console.log('Sum of values:', total);
