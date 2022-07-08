import { Component, Input } from '@angular/core';
import { NavPathTypes } from '@app/core/nav';

import { LoaderService } from '@app/shared/services';
import { Article, Link, MOCK_ARTICLES } from '@app/shared/types';

import { ArticleGridFacade } from './article-grid.facade';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrls: ['./article-grid.component.scss'],
  providers: [ArticleGridFacade],
})
export class ArticleGridComponent {
  @Input() articles: Article[];
  MOCK_ARTICLES = MOCK_ARTICLES;

  composeArticleLink: Link = {
    path: NavPathTypes.NEWS_COMPOSE,
    text: 'Compose new article',
    iconShape: 'plus-circle',
  };

  constructor(public facade: ArticleGridFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.facade.isLoading$.subscribe((isLoading) => {
      this.loader.display(isLoading);
    });
    this.facade.loadArticles();
  }
}
