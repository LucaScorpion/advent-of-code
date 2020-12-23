import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);
let lineNumber = 0;

interface Range {
  low: number;
  high: number;
}

interface Field {
  name: string;
  ranges: Range[];
}

const fields: Field[] = [];
while (input[lineNumber]) {
  const [name, ranges] = input[lineNumber].split(': ');
  const [r1, r2] = ranges.split(' or ');
  const [r1Low, r1High] = r1.split('-');
  const [r2Low, r2High] = r2.split('-');

  fields.push({
    name,
    ranges: [
      { low: parseInt(r1Low, 10), high: parseInt(r1High, 10) },
      { low: parseInt(r2Low, 10), high: parseInt(r2High, 10) },
    ],
  });

  lineNumber++;
}

lineNumber += 2;
const ourTicket = input[lineNumber].split(',').map((v) => parseInt(v, 10));

lineNumber += 3;
const nearbyTickets: number[][] = [];
while (lineNumber < input.length) {
  nearbyTickets.push(input[lineNumber].split(',').map((v) => parseInt(v, 10)));
  lineNumber++;
}

function isInRange(value: number, range: Range): boolean {
  return value >= range.low && value <= range.high;
}

function isInAnyRange(value: number, ranges: Range[]): boolean {
  return ranges.filter((r) => isInRange(value, r)).length > 0;
}

const ticketValuesPerField: number[][] = [...ourTicket.map((val) => [val])];

let errorRate = 0;
nearbyTickets.forEach((ticket) => {
  let isValid = true;

  ticket.forEach((val) => {
    let isValidAnyField = false;
    fields.forEach((field) => {
      if (isInAnyRange(val, field.ranges)) {
        isValidAnyField = true;
      }
    });

    if (!isValidAnyField) {
      errorRate += val;
      isValid = false;
    }
  });

  if (isValid) {
    ticket.forEach((val, i) => ticketValuesPerField[i].push(val));
  }
});

console.log('Error rate:', errorRate);

const fieldOptions = ticketValuesPerField.map((fieldValues) =>
  fields.filter((field) =>
    fieldValues.every((val) => isInAnyRange(val, field.ranges)),
  ),
);

const fieldNames: string[] = [];
for (let round = 0; round < fieldOptions.length; round++) {
  fieldOptions.forEach((opts, i) => {
    const freeOpts = opts.filter((opt) => !fieldNames.includes(opt.name));
    if (freeOpts.length === 1) {
      fieldNames[i] = freeOpts[0].name;
    }
  });
}

let total = 1;
fieldNames.forEach((name, i) => {
  if (name.startsWith('departure ')) {
    total *= ourTicket[i];
  }
});

console.log('Multiplied value:', total);
