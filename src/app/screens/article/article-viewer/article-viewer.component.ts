import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { ArticleComponent } from '@app/components/article/article.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { MetaAndTitleService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { Article, type Link, NavPathTypes } from '@app/types';

@UntilDestroy()
@Component({
  selector: 'lcc-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss'],
  imports: [AdminControlsComponent, ArticleComponent, CommonModule, LinkListComponent],
})
export class ArticleViewerComponent implements OnInit {
  public readonly NavPathTypes = NavPathTypes;

  public readonly links: Link[] = [
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
  public readonly selectArticleViewerViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleViewerViewModel,
  );

  constructor(
    private readonly store: Store,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    this.selectArticleViewerViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ article }) => {
        if (article?.title && article?.body) {
          // Limit to 200 characters
          const articlePreview =
            article.body.length > 197 ? article.body.slice(0, 197) + '...' : article.body;

          this.metaAndTitleService.updateTitle(article.title);
          this.metaAndTitleService.updateDescription(articlePreview);
        }
      });
  }

  public onDelete(article: Article): void {
    this.store.dispatch(ArticlesActions.deleteArticleSelected({ article }));
  }
}
