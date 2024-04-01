import * as uuid from 'uuid';

/**
 * @returns {string} An article ID based on the current date and a random string of hex
 * values
 */
export function generateArticleId(): string {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0].replaceAll('-', '');
  const uniqueId = uuid.v4().slice(-8);
  return `art-${formattedDate}-${uniqueId}`;
}

/**
 * @returns {string} An article image ID based on the article ID, the current date, and a
 * random string of hex values
 */
export function generateArticleImageId(articleId: string): string {
  const uniqueId = uuid.v4().slice(-8);
  return `${articleId}-img1-${uniqueId}`;
}

/**
 * @returns {boolean} Whether the article id is in a valid (LCC-specific) format
 */
export function isValidArticleId(articleId: string): boolean {
  const regExp = new RegExp(/^art-[0-9-]{10}-[a-fA-F0-9]{8}$/);
  return regExp.test(articleId);
}
