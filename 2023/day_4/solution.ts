import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

type Card = [number[], number[]];

const cards = lines.map(
  (l) => l.split(': ')[1].split(' | ').map(
    (p) => p.split(' ').filter((n) => !!n).map(
      (n) => parseInt(n),
    ),
  ),
) as Card[];

function cardPoints(c: Card): number {
  const winCount = c[0].filter((n) => c[1].includes(n)).length;
  return winCount > 0 ? Math.pow(2, winCount - 1) : 0;
}

let totalPoints = cards.reduce((acc, cur) => acc + cardPoints(cur), 0);
console.log(`Total points: ${totalPoints}`);

const cardCopiesByIndex: Record<number, number> = {};

function cardCopies(cardIndex: number): number {
  if (cardCopiesByIndex[cardIndex] != undefined) {
    return cardCopiesByIndex[cardIndex];
  }

  const c = cards[cardIndex];
  const winCount = c[0].filter((n) => c[1].includes(n)).length;

  let total = 1;
  for (let next = 1; next <= winCount; next++) {
    const nextIndex = cardIndex + next;
    total += cardCopies(nextIndex);
  }

  cardCopiesByIndex[cardIndex] = total;
  return total;
}

let totalCards = 0;
for (let i = cards.length - 1; i >= 0; i--) {
  totalCards += cardCopies(i);
}

console.log(`Total cards: ${totalCards}`);
