import fs from 'fs';

const [algo, imgInput] = fs.readFileSync(0).toString().trim().split('\n\n');
const imgInputLines = imgInput.split('\n');

interface Image {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  litPixels: Set<string>;
}

const initialImage: Image = {
  minX: 0,
  maxX: imgInputLines[0].length - 1,
  minY: 0,
  maxY: imgInputLines.length - 1,
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

function processImage(old: Image): Image {
  const result: Image = { ...old, litPixels: new Set() };

  // Process all pixels.
  for (let x = result.minX; x <= result.maxX; x++) {
    for (let y = result.minY; y <= result.maxY; y++) {
      // Get the number value for the pixel.
      let binary = '';
      for (let dY = -1; dY <= 1; dY++) {
        for (let dX = -1; dX <= 1; dX++) {
          const c = coordString(x + dX, y + dY);
          binary = `${binary}${old.litPixels.has(c) ? 1 : 0}`;
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
  result.minX -= 3;
  result.maxX += 3;
  result.minY -= 3;
  result.maxY += 3;

  result = processImage(processImage(result));

  // Remove one layer of padding.
  result.minX += 1;
  result.maxX -= 1;
  result.minY += 1;
  result.maxY -= 1;

  // Remove any lit pixels outside the image.
  for (let x = result.minX; x <= result.maxX; x++) {
    for (let y = result.minY; y <= result.maxY; y++) {
      if (x >= result.minX && x <= result.maxX && y >= result.minY && y <= result.maxY) {
        continue;
      }

      result.litPixels.delete(coordString(x, y));
    }
  }

  return result;
}

const afterTwo = processImageTwice(initialImage);
console.log(`Lit pixels after 2 enhancements: ${afterTwo.litPixels.size}`);
