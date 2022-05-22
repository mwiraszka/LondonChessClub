import { Component, OnInit } from '@angular/core';

import { LoaderService } from '@app/shared/services';

import { ArticleListFacade } from './store/article-list.facade';

@Component({
  selector: 'lcc-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  providers: [ArticleListFacade],
})
export class ArticleListComponent implements OnInit {
  constructor(public facade: ArticleListFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.facade.loadArticles();
    this.facade.isLoading$.subscribe((isLoading) => {
      this.loader.display(isLoading);
    });
  }
}
