import { Component, OnInit } from '@angular/core';

import { LoaderService } from '@app/services';
import { Article, Link, NavPathTypes } from '@app/types';
import { formatDate } from '@app/utils';

import { ArticleGridFacade } from './article-grid.facade';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrls: ['./article-grid.component.scss'],
  providers: [ArticleGridFacade],
})
export class ArticleGridComponent implements OnInit {
  formatDate = formatDate;

  createArticleLink: Link = {
    path: NavPathTypes.ARTICLE_ADD,
    text: 'Compose new article',
    iconShape: 'plus-circle',
  };

  constructor(public facade: ArticleGridFacade, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.facade.isLoading$.subscribe(isLoading => {
      this.loaderService.display(isLoading);
    });
    this.facade.loadArticles();
  }

  trackByFn = (index: number, article: Article) => article.id;
}
