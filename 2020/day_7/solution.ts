import fs from 'fs';

const input = fs.readFileSync(0).toString().trim().split(/\r?\n/);

interface ContainedBag {
  amount: number;
  color: string;
}

interface Rule {
  outerBag: string;
  innerBags: ContainedBag[];
}

const allColors: string[] = [];

const rules = input.map<Rule>((line) => {
  const [outer, inner] = line.split(' contain ');
  const [outerMod, outerColor] = outer.split(' ');

  const outerBag = `${outerMod} ${outerColor}`;
  allColors.push(outerBag);

  const innerBags =
    inner === 'no other bags.'
      ? []
      : inner.substring(0, inner.length - 1).split(', ').map<ContainedBag>(innerRule => {
        const [amountString, innerMod, innerColor] = innerRule.split(' ');
        return {
          amount: parseInt(amountString, 10),
          color: `${innerMod} ${innerColor}`,
        };
      });

  return {
    outerBag,
    innerBags,
  };
});

function containsShinyGoldBag(outerBag: string): boolean {
  const rule = rules.find(r => r.outerBag === outerBag)!;

  for (let i = 0; i < rule.innerBags.length; i++) {
    const innerBag = rule.innerBags[i];

    if (innerBag.color === 'shiny gold') {
      return true;
    }

    if (containsShinyGoldBag(innerBag.color)) {
      return true;
    }
  }

  return false;
}

const containsGold = allColors.filter(containsShinyGoldBag).length;
console.log('Bags containing shiny gold bags:', containsGold);
