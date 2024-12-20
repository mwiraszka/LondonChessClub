import { Article } from '@app/types';

import { customSort } from './general-utils';

/**
 * Sort articles based on date created, with sticky articles first
 */
export function sortArticles(articles: Article[]): Article[] {
  const stickyArticles = articles
    .filter(article => article.isSticky)
    .sort(customSort('modificationInfo.dateCreated'))
    .reverse();
  const remainingArticles = articles
    .filter(article => !article.isSticky)
    .sort(customSort('modificationInfo.dateCreated'))
    .reverse();

  return [...stickyArticles, ...remainingArticles];
}
