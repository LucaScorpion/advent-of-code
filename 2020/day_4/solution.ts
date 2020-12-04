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

function isPassportValid(passport: Passport): boolean {
  let isValid = true;
  mandatoryField.forEach(field => {
    const value = passport[field];
    if (value == undefined) {
      isValid = false;
      return;
    }
  });
  return isValid;
}

const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

function isPassportValidExtended(passport: Passport): boolean {
  let isValid = true;
  mandatoryField.forEach(field => {
    const value = passport[field];
    if (value == undefined) {
      isValid = false;
      return;
    }

    const numValue = parseInt(value, 10);
    switch (field) {
      case 'byr':
        isValid = isValid && (numValue >= 1920 && numValue <= 2002);
        break;
      case 'iyr':
        isValid = isValid && (numValue >= 2010 && numValue <= 2020);
        break;
      case 'eyr':
        isValid = isValid && (numValue >= 2020 && numValue <= 2030);
        break;
      case 'hgt':
        const heightNum = parseInt(value.substring(0, value.length - 2), 10);
        const unit = value.substring(value.length - 2);
        if (unit == 'cm') {
          isValid = isValid && (heightNum >= 150 && heightNum <= 193);
        } else if (unit == 'in') {
          isValid = isValid && (heightNum >= 59 && heightNum <= 76);
        } else {
          isValid = false;
        }
        break;
      case 'hcl':
        isValid = isValid && /^#[a-f0-9]{6}$/.test(value);
        break;
      case 'ecl':
        isValid = isValid && validEyeColors.includes(value);
        break;
      case 'pid':
        isValid = isValid && /^[0-9]{9}$/.test(value);
        break;
    }
  });
  return isValid;
}

console.log('Part 1 valid:', passports.filter(isPassportValid).length);
console.log('Part 2 valid:', passports.filter(isPassportValidExtended).length);
