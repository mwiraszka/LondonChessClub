import { Component, OnInit } from '@angular/core';
import { filter, first, tap } from 'rxjs/operators';

import { LoaderService } from '@app/shared/services';

import { ArticleListFacade } from './store/article-list.facade';

@Component({
  selector: 'lcc-article-list',
  templateUrl: './article-list.component.html',
  providers: [ArticleListFacade],
})
export class ArticleListComponent implements OnInit {
  constructor(public facade: ArticleListFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.loader.display(true);
    this.facade.loadArticles();
    this.facade.articles$
      .pipe(
        filter((articles) => !!articles),
        tap(() => this.loader.display(false)),
        first()
      )
      .subscribe();
  }
}
