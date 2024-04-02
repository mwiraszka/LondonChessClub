import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Component, Input, OnInit } from '@angular/core';

import { Article, type Link, NavPathTypes } from '@app/types';

import { ArticleGridFacade } from './article-grid.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrls: ['./article-grid.component.scss'],
  providers: [ArticleGridFacade],
})
export class ArticleGridComponent implements OnInit {
  readonly NavPathTypes = NavPathTypes;

  @Input() maxArticles?: number;

  articles!: Article[];
  createArticleLink: Link = {
    path: NavPathTypes.ARTICLE_ADD,
    text: 'Compose new article',
    iconShape: 'plus-circle',
  };

  constructor(public facade: ArticleGridFacade) {}

  ngOnInit(): void {
    this.facade.fetchArticles();

    this.facade.articles$.pipe(untilDestroyed(this)).subscribe(articles => {
      this.articles = articles.slice(0, this.maxArticles ?? articles.length);
    });
  }
}
