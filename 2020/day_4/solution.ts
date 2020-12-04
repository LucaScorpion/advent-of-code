import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);

const passportStrings: string[] = [''];
input.forEach(line => {
  if (line) {
    passportStrings[passportStrings.length - 1] = `${passportStrings[passportStrings.length - 1]} ${line}`.trim();
  } else {
    passportStrings.push('');
  }
});

type Passport = Record<string, string>;

const passports = passportStrings.map(ps => {
  const parsed: Passport = {};
  ps.split(' ').forEach(p => {
    const [key, value] = p.split(':');
    parsed[key] = value;
  });
  return parsed;
});

const mandatoryField = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
  // 'cid'
];

function isValid(passport: Passport): boolean {
  let isValid = true;
  mandatoryField.forEach(field => {
    const value = passport[field];
    if (value == undefined) {
      isValid = false;
    }
  });
  return isValid;
}

const validPassports = passports.filter(isValid).length;
console.log(validPassports, 'valid passports');
