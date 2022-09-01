import { Component, OnInit } from '@angular/core';

import { LoaderService } from '@app/services';
import { Link, NavPathTypes } from '@app/types';

import { ArticleGridFacade } from './article-grid.facade';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrls: ['./article-grid.component.scss'],
  providers: [ArticleGridFacade],
})
export class ArticleGridComponent implements OnInit {
  composeArticleLink: Link = {
    path: NavPathTypes.ARTICLE_ADD,
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
