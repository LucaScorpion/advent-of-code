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

function isValid(entry: PasswordEntry): boolean {
  const removed = entry.password.split(entry.policyLetter).join('');
  const lengthDiff = entry.password.length - removed.length;
  return lengthDiff >= entry.policyRangeFrom && lengthDiff <= entry.policyRangeTo;
}

const corrupted = entries.filter(isValid);

console.log('Valid entries:', corrupted.length)
