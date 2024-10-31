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
  readonly FIVE_MINUTES_MS = 300_000;
  readonly NavPathTypes = NavPathTypes;

  @Input() maxArticles?: number;

  articles!: Article[];
  createArticleLink: Link = {
    path: NavPathTypes.ARTICLE + '/' + NavPathTypes.ADD,
    text: 'Create new article',
    icon: 'plus-circle',
  };

  constructor(public facade: ArticleGridFacade) {}

  ngOnInit(): void {
    this.facade.fetchArticles();

    this.facade.articles$.pipe(untilDestroyed(this)).subscribe(articles => {
      this.articles = articles.slice(0, this.maxArticles ?? articles.length);
    });
  }

  wasEdited(article: Article): boolean {
    if (!article || !article.modificationInfo) {
      return false;
    }

    return (
      article.modificationInfo.dateLastEdited.getTime() -
        article.modificationInfo.dateCreated.getTime() >
      this.FIVE_MINUTES_MS
    );
  }
}
