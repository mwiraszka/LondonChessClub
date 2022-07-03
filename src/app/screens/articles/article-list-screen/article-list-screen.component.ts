import { Component, OnInit } from '@angular/core';
import { announcementIcon, ClarityIcons, plusCircleIcon } from '@cds/core/icon';

import { LoaderService } from '@app/shared/services';

import { ArticleListScreenFacade } from './article-list-screen.facade';

@Component({
  selector: 'lcc-article-list-screen',
  templateUrl: './article-list-screen.component.html',
  styleUrls: ['./article-list-screen.component.scss'],
  providers: [ArticleListScreenFacade],
})
export class ArticleListScreenComponent implements OnInit {
  constructor(public facade: ArticleListScreenFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.facade.isLoading$.subscribe((isLoading) => {
      this.loader.display(isLoading);
    });
    ClarityIcons.addIcons(announcementIcon, plusCircleIcon);
    this.facade.loadArticles();
  }
}
