import fs from 'fs';

type Direction = 'R' | 'L' | 'U' | 'D';

type Orientation = 'horizontal' | 'vertical';

interface WireSegment {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  direction: Direction;
}

interface Pos {
  x: number;
  y: number;
}

function parseWireSegments(line: string): WireSegment[] {
  const segments: WireSegment[] = [];
  let lastSegment: WireSegment = {
    fromX: 0,
    fromY: 0,
    toX: 0,
    toY: 0,
    direction: 'D',
  };

  line.split(',').forEach(part => {
    // Parse the line.
    const direction = part.substring(0, 1) as Direction;
    const length = parseInt(part.substring(1), 10);
    // Get the new segment info.
    const [toX, toY] = getTargetCoords(lastSegment.toX, lastSegment.toY, direction, length);
    lastSegment = {
      direction,
      fromX: lastSegment.toX,
      fromY: lastSegment.toY,
      toX,
      toY,
    };
    segments.push(lastSegment);
  });
  return segments;
}

function getOrientation(dir: Direction): Orientation {
  return (dir === 'R' || dir === 'L') ? 'horizontal' : 'vertical';
}

function getTargetCoords(x: number, y: number, dir: Direction, length: number): [number, number] {
  switch (dir) {
    case 'R':
      return [x + length, y];
    case 'L':
      return [x - length, y];
    case 'U':
      return [x, y + length];
    case 'D':
      return [x, y - length];
  }
}

function isInRange(val: number, min: number, max: number): boolean {
  if (min > max) {
    return isInRange(val, max, min);
  }
  return val >= min && val <= max;
}

function getIntersectionPos(seg1: WireSegment, seg2: WireSegment): Pos | undefined {
  // Get both orientations. If the lines are parallel they don't intersect.
  const seg1Orientation = getOrientation(seg1.direction);
  if (seg1Orientation === getOrientation(seg2.direction)) {
    return;
  }

  const hor = seg1Orientation === 'horizontal' ? seg1 : seg2;
  const vert = seg1Orientation === 'vertical' ? seg1 : seg2;

  // Get the possible intersection.
  const possibleIntersect: Pos = {
    x: vert.fromX,
    y: hor.fromY,
  };

  // Check if the x is a point on the horizontal line, and vice versa.
  if (isInRange(possibleIntersect.x, hor.fromX, hor.toX) && isInRange(possibleIntersect.y, vert.fromY, vert.toY)) {
    return possibleIntersect;
  }

  // Intersection is not on both lines!
}

const lines = fs.readFileSync(0).toString().trim().split('\n');
const wire1 = parseWireSegments(lines[0]);
const wire2 = parseWireSegments(lines[1]);
const intersections: Pos[] = [];

wire1.forEach(seg1 => {
  wire2.forEach(seg2 => {
    const intersection = getIntersectionPos(seg1, seg2);
    if (intersection) {
      intersections.push(intersection);
    }
  });
});

const closesDist = intersections.map(i => Math.abs(i.x) + Math.abs(i.y)).reduce((acc, cur) => (!acc || cur < acc) ? cur : acc, 0);
console.log('Closest intersection is:', closesDist);
