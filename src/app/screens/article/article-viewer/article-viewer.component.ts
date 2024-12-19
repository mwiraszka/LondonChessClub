import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { ArticleComponent } from '@app/components/article/article.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { MetaAndTitleService } from '@app/services';
import { type Link, NavPathTypes } from '@app/types';

import { ArticleViewerFacade } from './article-viewer.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss'],
  providers: [ArticleViewerFacade],
  imports: [AdminControlsComponent, ArticleComponent, CommonModule, LinkListComponent],
})
export class ArticleViewerComponent implements OnInit {
  readonly NavPathTypes = NavPathTypes;

  links: Link[] = [
    {
      icon: 'activity',
      path: NavPathTypes.NEWS,
      text: 'More articles',
    },
    {
      icon: 'home',
      path: NavPathTypes.HOME,
      text: 'Return home',
    },
  ];

  constructor(
    public facade: ArticleViewerFacade,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    this.facade.article$.pipe(untilDestroyed(this)).subscribe(article => {
      if (article?.title && article?.body) {
        // Limit to 200 characters
        const articlePreview =
          article.body.length > 197 ? article.body.slice(0, 197) + '...' : article.body;

        this.metaAndTitleService.updateTitle(article.title);
        this.metaAndTitleService.updateDescription(articlePreview);
      }
    });
  }
}
