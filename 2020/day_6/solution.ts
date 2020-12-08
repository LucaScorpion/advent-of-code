import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);

const groups: string[][] = [[]];

input.forEach((line) => {
  if (!line) {
    groups.push([]);
    return;
  }

  groups[groups.length - 1].push(line);
});

let anyYesCount = 0;
groups.forEach((group) => {
  const yesAnswers = new Set<string>();

  group.forEach((member) => {
    member.split('').forEach((q) => yesAnswers.add(q));
  });

  anyYesCount += yesAnswers.size;
});

let everyYesCount = 0;
groups.forEach((group) => {
  const yesAnswers: Record<string, number> = {};

  group.forEach((member) => {
    member.split('').forEach((q) => {
      const currentYesCount = yesAnswers[q] || 0;
      yesAnswers[q] = currentYesCount + 1;
    });
  });

  everyYesCount += Object.entries(yesAnswers)
    .filter(([, value]) => value === group.length).length;
});

console.log('Sum of any yes count:', anyYesCount);
console.log('Sum of every yes count:', everyYesCount);
