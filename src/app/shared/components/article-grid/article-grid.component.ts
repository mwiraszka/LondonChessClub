import { Component, Input } from '@angular/core';
import { ClarityIcons, plusCircleIcon } from '@cds/core/icon';

import { LoaderService } from '@app/shared/services';
import { Article } from '@app/shared/types';

import { ArticleGridFacade } from './article-grid.facade';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrls: ['./article-grid.component.scss'],
  providers: [ArticleGridFacade],
})
export class ArticleGridComponent {
  @Input() articles: Article[];

  constructor(public facade: ArticleGridFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.facade.isLoading$.subscribe((isLoading) => {
      this.loader.display(isLoading);
    });

    ClarityIcons.addIcons(plusCircleIcon);
    this.facade.loadArticles();
  }
}
