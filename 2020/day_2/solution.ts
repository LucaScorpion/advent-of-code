import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);

interface PasswordEntry {
  password: string;
  policyRangeFrom: number;
  policyRangeTo: number;
  policyLetter: string;
}

const entries: PasswordEntry[] = input.map(line => {
  const parts = line.split(':'); // [ '5-6 z', ' zzbwrv' ]
  const rawPolicy = parts[0];
  const policyParts = rawPolicy.split(' '); // [ '5-6', 'z' ]
  const policyRangeRaw = policyParts[0];
  const rangeParts = policyRangeRaw.split('-'); // [ '5', '6' ]

  return ({
    password: parts[1].trim(),
    policyLetter: policyParts[1],
    policyRangeFrom: parseInt(rangeParts[0], 10),
    policyRangeTo: parseInt(rangeParts[1], 10),
  });
});

function isValidPart1(entry: PasswordEntry): boolean {
  const removed = entry.password.split(entry.policyLetter).join('');
  const lengthDiff = entry.password.length - removed.length;
  return lengthDiff >= entry.policyRangeFrom && lengthDiff <= entry.policyRangeTo;
}

function isValidPart2(entry: PasswordEntry): boolean {
  const charFrom = entry.password.charAt(entry.policyRangeFrom - 1);
  const charTo = entry.password.charAt(entry.policyRangeTo - 1);

  if (charFrom == entry.policyLetter && charTo == entry.policyLetter) {
    return false;
  }
  return charFrom == entry.policyLetter || charTo == entry.policyLetter;
}

console.log('Valid entries part 1:', entries.filter(isValidPart1).length);
console.log('Valid entries part 2:', entries.filter(isValidPart2).length);
