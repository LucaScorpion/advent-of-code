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

let yesCounts = 0;
groups.forEach((group) => {
  const yesAnswers = new Set<string>();

  group.forEach((member) => {
    member.split('').forEach((q) => yesAnswers.add(q));
  });

  yesCounts += yesAnswers.size;
});

console.log('Sum of yes counts:', yesCounts);
