/**
 * Calculate the width (in pixels) of the provided text, given font and container's max width.
 *
 * @param text
 * @param maxLineWidth Maximum space available for the text on each line (px)
 * @param font All relevant font information, space-separated (e.g. `'italic 16pt Verdana'`)
 *
 * Return `-1` if text is not a valid string or unable to create canvas context.
 */
export function getTextWidth(
  text: unknown,
  maxLineWidth?: number,
  font = '13px sans-serif',
): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (typeof text !== 'string' || !context) {
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
