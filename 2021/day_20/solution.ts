import fs from 'fs';

const [algo, imgInput] = fs.readFileSync(0).toString().trim().split('\n\n');
const imgInputLines = imgInput.split('\n');

interface Image {
  left: number;
  right: number;
  top: number;
  bottom: number;
  litPixels: Set<string>;
}

const initialImage: Image = {
  left: 0,
  right: imgInputLines[0].length - 1,
  top: 0,
  bottom: imgInputLines.length - 1,
  litPixels: new Set(),
};

imgInputLines.forEach((line, y) => {
  for (let x = 0; x < line.length; x++) {
    if (line[x] === '#') {
      initialImage.litPixels.add(coordString(x, y));
    }
  }
});

function coordString(x: number, y: number): string {
  return `${x},${y}`;
}

function processImage(old: Image, defaultLit: boolean): Image {
  const result: Image = { ...old, litPixels: new Set() };

  // Process all pixels.
  for (let x = result.left - 1; x <= result.right + 1; x++) {
    for (let y = result.top - 1; y <= result.bottom + 1; y++) {
      // Get the number value for the pixel.
      let binary = '';
      for (let dY = -1; dY <= 1; dY++) {
        for (let dX = -1; dX <= 1; dX++) {
          let nX = x + dX;
          let nY = y + dY;
          let lit: boolean;

          if (nX < result.left || nX > result.right || nY < result.top || nY > result.bottom) {
            lit = defaultLit;
          } else {
            lit = old.litPixels.has(coordString(nX, nY));
          }

          binary = `${binary}${lit ? 1 : 0}`;
        }
      }

      const num = parseInt(binary, 2);
      if (algo[num] === '#') {
        result.litPixels.add(coordString(x, y));
      }
    }
  }

  return result;
}

function processImageTwice(old: Image): Image {
  let result = { ...old };

  // Pad the entire image.
  result.left -= 1;
  result.right += 1;
  result.top -= 1;
  result.bottom += 1;

  result = processImage(processImage(result, false), algo[0] === '#');

  // Remove one layer of padding.
  // result.minX += 1;
  // result.maxX -= 1;
  // result.minY += 1;
  // result.maxY -= 1;

  // Remove any lit pixels outside the image.
  for (let x = result.left; x <= result.right; x++) {
    for (let y = result.top; y <= result.bottom; y++) {
      if (x >= result.left && x <= result.right && y >= result.top && y <= result.bottom) {
        continue;
      }

      // result.litPixels.delete(coordString(x, y));
    }
  }

  return result;
}

const afterTwo = processImageTwice(initialImage);
console.log(`Lit pixels after 2 enhancements: ${afterTwo.litPixels.size}`);
