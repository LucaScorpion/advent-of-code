import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

const handsWithBid: [string, number][] = lines.map((l) => {
  const [hand, bidStr] = l.split(' ');
  return [hand, parseInt(bidStr)];
});

const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

enum HandType {
  HighCard,
  OnePair,
  TwoPair,
  ThreeKind,
  FullHouse,
  FourKind,
  FiveKind
}

function getHandType(hand: string): HandType {
  const cardCounts: [string, number][] = [];
  hand.split('').forEach((card) => {
    const entry = cardCounts.find((e) => e[0] === card);
    if (entry) {
      entry[1]++;
    } else {
      cardCounts.push([card, 1]);
    }
  });
  cardCounts.sort((a, b) => b[1] - a[1]);

  switch (cardCounts.length) {
    case 5:
      return HandType.HighCard;
    case 4:
      return HandType.OnePair;
    case 3:
      return cardCounts[0][1] === 3 ? HandType.ThreeKind : HandType.TwoPair;
    case 2:
      return cardCounts[0][1] === 4 ? HandType.FourKind : HandType.FullHouse;
    case 1:
      return HandType.FiveKind;
    default:
      throw new Error(`Could not determine hand type: ${hand}`);
  }
}

function compareHands(a: string, b: string) {
  const aType = getHandType(a);
  const bType = getHandType(b);
  if (aType !== bType) {
    return bType - aType;
  }

  for (let i = 0; i < a.length; i++) {
    const highCardCompare = compareCards(a[i], b[i]);
    if (highCardCompare !== 0) {
      return highCardCompare;
    }
  }

  throw new Error(`Could not compare hands: ${a} - ${b}`);
}

function compareCards(a: string, b: string) {
  return cards.indexOf(a) - cards.indexOf(b);
}

// Sorted weak to strong.
const sortedHands = handsWithBid.toSorted((a, b) => compareHands(b[0], a[0]));

let totalWinnings = 0;
sortedHands.forEach((h, i) => {
  totalWinnings += (i + 1) * h[1];
});

console.log(totalWinnings);
