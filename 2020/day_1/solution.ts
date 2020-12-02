import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map(s => parseInt(s, 10));

// Part 1

outer:
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const iVal = input[i];
      const jVal = input[j];
      if (iVal + jVal === 2020) {
        console.log(iVal, '+', jVal, '= 2020');
        console.log(iVal, '*', jVal, '=', iVal * jVal);
        break outer;
      }
    }
  }

// Part 2

outer:
  for (let i = 0; i < input.length - 2; i++) {
    for (let j = i + 1; j < input.length; j++) {
      for (let k = j + 1; k < input.length; k++) {
        const iVal = input[i];
        const jVal = input[j];
        const kVal = input[k];
        if (iVal + jVal + kVal === 2020) {
          console.log(iVal, '+', jVal, '+', kVal, '= 2020');
          console.log(iVal, '*', jVal, '*', kVal, '=', iVal * jVal * kVal);
          break outer;
        }
      }
    }
  }
