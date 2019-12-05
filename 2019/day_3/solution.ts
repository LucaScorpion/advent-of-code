import fs from 'fs';

type Direction = 'R' | 'L' | 'U' | 'D';

type Orientation = 'horizontal' | 'vertical';

interface WireSegment {
  from: Pos;
  to: Pos;
  direction: Direction;
  length: number;
}

interface Pos {
  x: number;
  y: number;
}

function parseWireSegments(line: string): WireSegment[] {
  const segments: WireSegment[] = [];
  let lastSegment: WireSegment = {
    from: {
      x: 0,
      y: 0,
    },
    to: {
      x: 0,
      y: 0,
    },
    direction: 'D',
    length: 0,
  };

  line.split(',').forEach(part => {
    // Parse the line.
    const direction = part.substring(0, 1) as Direction;
    const length = parseInt(part.substring(1), 10);
    // Get the new segment info.
    const to = getTargetCoords(lastSegment.to, direction, length);
    lastSegment = {
      direction,
      length,
      to,
      from: {
        x: lastSegment.to.x,
        y: lastSegment.to.y,
      },
    };
    segments.push(lastSegment);
  });
  return segments;
}

function getOrientation(dir: Direction): Orientation {
  return (dir === 'R' || dir === 'L') ? 'horizontal' : 'vertical';
}

function getTargetCoords(from: Pos, dir: Direction, length: number): Pos {
  const { x, y } = from;
  switch (dir) {
    case 'R':
      return { x: x + length, y };
    case 'L':
      return { x: x - length, y };
    case 'U':
      return { x, y: y + length };
    case 'D':
      return { x, y: y - length };
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
    x: vert.from.x,
    y: hor.from.y,
  };

  // Check if the x is a point on the horizontal line, and vice versa.
  if (isInRange(possibleIntersect.x, hor.from.x, hor.to.x) && isInRange(possibleIntersect.y, vert.from.y, vert.to.y)) {
    return possibleIntersect;
  }

  // Intersection is not on both lines!
}

function getSegmentDelay(point: Pos, lineFrom: Pos, lineTo: Pos): number | false {
  // Check if the point is even on the segment.
  if (!isInRange(point.x, lineFrom.x, lineTo.x) || !isInRange(point.y, lineFrom.y, lineTo.y)) {
    return false;
  }

  const diff: Pos = {
    x: point.x - lineFrom.x,
    y: point.y - lineFrom.y,
  };
  return Math.abs(diff.x) + Math.abs(diff.y);
}

function getDelay(wire: WireSegment[], intersection: Pos): number {
  let delay = 0;
  for (let segment of wire) {
    // Check if the intersection is on this segment.
    const segmentDelay = getSegmentDelay(intersection, segment.from, segment.to);

    // If the intersection is not on this segment, add the entire segment length to the delay.
    if (segmentDelay === false) {
      delay += segment.length;
    } else {
      delay += segmentDelay;
      break;
    }
  }
  return delay;
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
console.log('Closest intersection:', closesDist);

const leastDelay = intersections.map(i => getDelay(wire1, i) + getDelay(wire2, i)).reduce((acc, cur) => (!acc || cur < acc) ? cur : acc, 0);
console.log('Least delay:', leastDelay);
