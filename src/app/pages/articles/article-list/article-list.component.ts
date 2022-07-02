import { Component, OnInit } from '@angular/core';
import { announcementIcon, ClarityIcons, plusCircleIcon } from '@cds/core/icon';

import { LoaderService } from '@app/shared/services';

import { ArticleListFacade } from './article-list.facade';

@Component({
  selector: 'lcc-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  providers: [ArticleListFacade],
})
export class ArticleListComponent implements OnInit {
  constructor(public facade: ArticleListFacade, private loader: LoaderService) {}

  ngOnInit(): void {
    this.facade.isLoading$.subscribe((isLoading) => {
      this.loader.display(isLoading);
    });
    ClarityIcons.addIcons(announcementIcon, plusCircleIcon);
    this.facade.loadArticles();
  }
}
