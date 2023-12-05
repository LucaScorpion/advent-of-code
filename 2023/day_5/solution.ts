import * as fs from 'fs';

const blocks = fs.readFileSync(0).toString().trim().split('\n\n');
const seeds = blocks[0].substring(7).split(' ').map(Number);

type Category = 'seed' | 'soil' | 'fertilizer' | 'water' | 'light' | 'temperature' | 'humidity' | 'location';

interface CategoryMap {
  src: Category;
  dest: Category;
  ranges: RangeMap[];
}

interface RangeMap {
  destRangeStart: number;
  srcRangeStart: number;
  rangeLength: number;
}

const maps: CategoryMap[] = blocks.slice(1).map((block) => {
  const lines = block.trim().split('\n');
  const [src, dest] = lines[0].split(' ')[0].split('-to-') as Category[];

  return {
    src,
    dest,
    ranges: lines.slice(1).map((l) => {
      const nums = l.split(' ').map(Number);
      return {
        destRangeStart: nums[0],
        srcRangeStart: nums[1],
        rangeLength: nums[2],
      };
    }),
  };
});

function mapSrcDest(src: Category, dest: Category, srcVal: number): number {
  const m = maps.find((m) => m.src === src);
  if (!m) {
    throw new Error(`Could not find map from ${src}`);
  }

  let destVal = srcVal;

  m.ranges.forEach((range) => {
    if (srcVal >= range.srcRangeStart && srcVal < range.srcRangeStart + range.rangeLength) {
      destVal = range.destRangeStart + (srcVal - range.srcRangeStart);
    }
  });

  return m.dest === dest ? destVal : mapSrcDest(m.dest, dest, destVal);
}

const lowestLocation = Math.min(...seeds.map((s) => mapSrcDest('seed', 'location', s)));
console.log(`Lowest location: ${lowestLocation}`);
