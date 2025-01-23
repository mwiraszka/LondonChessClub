import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';

import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';

import { AdminControlsDirective } from '@app/components/admin-controls/admin-controls.directive';
import { ArticleComponent } from '@app/components/article/article.component';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import type {
  AdminControlsConfig,
  Article,
  BasicDialogResult,
  Dialog,
  InternalLink,
} from '@app/models';
import { DialogService, MetaAndTitleService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { isDefined } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-article-viewer-screen',
  template: `
    @if (articleViewerScreenViewModel$ | async; as vm) {
      @if (vm.article) {
        <lcc-article
          [adminControls]="vm.isAdmin ? getAdminControlsConfig(vm.article) : null"
          [article]="vm.article"
          [bannerImageUrl]="vm.bannerImageUrl">
        </lcc-article>
        <lcc-link-list [links]="links"></lcc-link-list>
      }
    }
  `,
  imports: [AdminControlsDirective, ArticleComponent, CommonModule, LinkListComponent],
})
export class ArticleViewerScreenComponent implements OnInit {
  public readonly links: InternalLink[] = [
    {
      text: 'More articles',
      internalPath: 'news',
      icon: 'activity',
    },
    {
      text: 'Return home',
      internalPath: '',
      icon: 'home',
    },
  ];
  public readonly articleViewerScreenViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleViewerScreenViewModel,
  );

  constructor(
    private readonly dialogService: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    @Inject(DOCUMENT) private _document: Document,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.articleViewerScreenViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ article, bannerImageUrl }) => {
        if (!isDefined(bannerImageUrl) && isDefined(article?.imageId)) {
          this.store.dispatch(
            ImagesActions.fetchArticleBannerImageRequested({ imageId: article.imageId }),
          );
        }

        if (article?.title && article?.body) {
          const articlePreview =
            article.body.length > 197 ? article.body.slice(0, 197) + '...' : article.body;
          this.metaAndTitleService.updateTitle(article.title);
          this.metaAndTitleService.updateDescription(articlePreview);
        }
      });

    this.setUpRouterListener();
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

  public getAdminControlsConfig(article: Article): AdminControlsConfig {
    return {
      buttonSize: 34,
      deleteCb: () => this.onDelete(article),
      editPath: ['article', 'edit', article.id!],
      itemName: article.title,
    };
  }

  public async onDelete(article: Article): Promise<void> {
    const dialog: Dialog = {
      title: 'Delete article',
      body: `Update ${article.title}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    if (result === 'confirm') {
      this.store.dispatch(ArticlesActions.deleteArticleRequested({ article }));
    }
  }
}
