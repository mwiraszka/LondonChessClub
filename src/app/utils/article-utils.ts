import * as uuid from 'uuid';

import { Article } from '@app/types';

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

export const articleIdRegExp: RegExp = /^art-[0-9]{8}-[a-fA-F0-9]{8}$/;

/**
 * @returns {boolean} Returns true when article was edited on a date different
 * from the creation date (i.e. the next calendar day onwards)
 */
export function wasEdited(article?: Article): boolean {
  if (!article || !article.modificationInfo) {
    return false;
  }

  return (
    article.modificationInfo.dateLastEdited.toDateString() !==
    article.modificationInfo.dateCreated.toDateString()
  );
}
