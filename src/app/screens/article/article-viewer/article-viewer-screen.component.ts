import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { ArticleComponent } from '@app/components/article/article.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { MetaAndTitleService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { Article, type Link, NavPathTypes } from '@app/types';

@UntilDestroy()
@Component({
  selector: 'lcc-article-viewer-screen',
  templateUrl: './article-viewer-screen.component.html',
  imports: [AdminControlsComponent, ArticleComponent, CommonModule, LinkListComponent],
})
export class ArticleViewerScreenComponent implements OnInit {
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
  public readonly articleViewerScreenViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleViewerScreenViewModel,
  );

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private readonly router: Router,
    private readonly store: Store,
    private readonly metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    this.articleViewerScreenViewModel$
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

    this.setUpRouterListener();
  }

  public onDelete(article: Article): void {
    this.store.dispatch(ArticlesActions.deleteArticleSelected({ article }));
  }

  private setUpRouterListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof Scroll),
        untilDestroyed(this),
      )
      .subscribe(event =>
        // TODO: needs fixing
        setTimeout(() => this.scrollToAnchor((event as Scroll).anchor!), 1000),
      );
  }

  private scrollToAnchor(anchorToScrollTo?: string): void {
    const elementToScrollTo = this._document.getElementById(anchorToScrollTo ?? 'main');

    if (elementToScrollTo) {
      setTimeout(() => {
        elementToScrollTo.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }, 200);
    }
  }
}
