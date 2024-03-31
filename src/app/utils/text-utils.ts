/**
 * Converts any string to kebab-case
 * (see https://www.geeksforgeeks.org/how-to-convert-a-string-into-kebab-case-using-javascript)
 *
 * @param {string} anyString The input string Like This, LikeThis, or Like_This
 *
 * @returns {string} The same text in kebab-case
 */
export function kebabize(anyString: string): string {
  const wordArray = anyString
    .replace('.', '')
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
  return wordArray?.join('-').toLowerCase() ?? '';
}

/**
 * Converts kebab-case to CamelCase
 *
 * @param {string} kebabString The input string in kebab-case
 *
 * @returns {string} The same text in camelCase
 */
export function camelize(kebabString: string): string {
  return kebabString.replace(/-./g, hyphen => hyphen[1].toUpperCase());
}

/**
 * Calculates the width of the canvas for the given text and an optional canvas max width
 *
 * @param {string | null} text The text
 * @param {number} maxLineWidth Maximum space available for the text on each line (px)
 * @param font All font information that affects text width, space-separated
 * (e.g. 'italic 16pt Verdana')
 *
 * @returns {number} The width in pixels (-1 denotes failure in creating context)
 */
export function getTextWidth(
  text: string | null,
  maxLineWidth?: number,
  font = '13px sans-serif',
): number {
  if (!text) {
    return 0;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return -1;
  }

  context.font = font;

  if (!maxLineWidth) {
    return context.measureText(text).width;
  }

  const words = text.split(' ');
  let word = words.shift();
  let lineText = '';
  let lineWidth = 0;
  let longestLineWidth = 0;

  while (word) {
    if (context.measureText(word).width >= maxLineWidth) {
      return maxLineWidth;
    }

    lineText = lineText === '' ? word : lineText + ' ' + word;
    lineWidth = context.measureText(lineText).width;

    if (lineWidth > maxLineWidth) {
      words.unshift(word);
      lineWidth = 0;
      lineText = '';
    } else {
      longestLineWidth = Math.max(longestLineWidth, lineWidth);
    }

    word = words.shift();
  }

  return longestLineWidth;
}
