import { Article } from '@app/types';
import { customSort, isDefined } from '@app/utils';

// TODO: Modify customSort() to accept an optional secondary key so that this can be done in one go
/**
 * Sort articles by date created, then by bookmark date
 */
export function sortArticles(articles: Article[]): Article[] {
  const bookmarkedArticles = articles.filter(article => isDefined(article.bookmarkDate));
  const remainingArticles = articles.filter(article => !isDefined(article.bookmarkDate));

  return [
    ...bookmarkedArticles.sort(customSort('bookmarkDate')).reverse(),
    ...remainingArticles.sort(customSort('modificationInfo.dateCreated')).reverse(),
  ];
}
