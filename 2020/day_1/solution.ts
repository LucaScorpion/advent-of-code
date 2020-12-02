import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/)
  .map(s => parseInt(s, 10));

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
