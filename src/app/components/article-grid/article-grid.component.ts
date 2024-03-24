import { Component, Input, OnInit } from '@angular/core';

import { type Article, type Link, NavPathTypes } from '@app/types';

import { ArticleGridFacade } from './article-grid.facade';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrls: ['./article-grid.component.scss'],
  providers: [ArticleGridFacade],
})
export class ArticleGridComponent implements OnInit {
  readonly NavPathTypes = NavPathTypes;

  @Input() maxArticles?: number;

  createArticleLink: Link = {
    path: NavPathTypes.ARTICLE_ADD,
    text: 'Compose new article',
    iconShape: 'plus-circle',
  };

  constructor(public facade: ArticleGridFacade) {}

  ngOnInit(): void {
    this.facade.fetchArticles();
  }

  trackByFn = (index: number, article: Article) => article.id;
}
