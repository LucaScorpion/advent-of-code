import * as fs from 'fs';

const lines = fs.readFileSync(0).toString().trim().split('\n');

const handsWithBid: [string, number][] = lines.map((l) => {
  const [hand, bidStr] = l.split(' ');
  return [hand, parseInt(bidStr)];
});

const CARD_ORDER = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const CARD_ORDER_WITH_JOKER = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

enum HandType {
  HighCard,
  OnePair,
  TwoPair,
  ThreeKind,
  FullHouse,
  FourKind,
  FiveKind
}

function getCardCounts(hand: string): [string, number][] {
  const cardCounts: [string, number][] = [];
  hand.split('').forEach((card) => {
    const entry = cardCounts.find((e) => e[0] === card);
    if (entry) {
      entry[1]++;
    } else {
      cardCounts.push([card, 1]);
    }
  });
  return cardCounts.sort((a, b) => b[1] - a[1]);
}

function getHandType(hand: string): HandType {
  const cardCounts = getCardCounts(hand);
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

function getHandTypeWithJoker(hand: string): HandType {
  const handWithoutJokers = hand.replaceAll('J', '');
  if (handWithoutJokers.length === 0) {
    return HandType.FiveKind;
  }

  const cardCounts = getCardCounts(handWithoutJokers);
  return getHandType(hand.replaceAll('J', cardCounts[0][0]));
}

function compareHands(a: string, b: string, handTypeFn: (hand: string) => HandType, cardOrder: string[]) {
  const aType = handTypeFn(a);
  const bType = handTypeFn(b);
  if (aType !== bType) {
    return bType - aType;
  }

  for (let i = 0; i < a.length; i++) {
    const highCardCompare = cardOrder.indexOf(a[i]) - cardOrder.indexOf(b[i]);
    if (highCardCompare !== 0) {
      return highCardCompare;
    }
  }

  throw new Error(`Could not compare hands: ${a} - ${b}`);
}

// Sorted weak to strong.
const sortedHands = handsWithBid.toSorted((a, b) => compareHands(b[0], a[0], getHandType, CARD_ORDER));
let totalWinningsOne = 0;
sortedHands.forEach((h, i) => {
  totalWinningsOne += (i + 1) * h[1];
});
console.log(`Total winnings without joker: ${totalWinningsOne}`);

const sortedHandsTwo = handsWithBid.toSorted((a, b) => compareHands(b[0], a[0], getHandTypeWithJoker, CARD_ORDER_WITH_JOKER));
let totalWinningsTwo = 0;
sortedHandsTwo.forEach((h, i) => {
  totalWinningsTwo += (i + 1) * h[1];
});
console.log(`Total winnings with joker: ${totalWinningsTwo}`);
