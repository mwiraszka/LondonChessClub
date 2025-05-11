import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleComponent } from '@app/components/article/article.component';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
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
  selector: 'lcc-article-viewer-page',
  template: `
    @if (articleViewerPageViewModel$ | async; as vm) {
      @if (vm.article) {
        <lcc-article
          [adminControls]="vm.isAdmin ? getAdminControlsConfig(vm.article) : null"
          [article]="vm.article">
        </lcc-article>
        <lcc-link-list [links]="links"></lcc-link-list>
      }
    }
  `,
  imports: [AdminControlsDirective, ArticleComponent, CommonModule, LinkListComponent],
})
export class ArticleViewerPageComponent implements OnInit {
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
  public readonly articleViewerPageViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleViewerPageViewModel,
  );

  constructor(
    private readonly dialogService: DialogService,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.articleViewerPageViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ article }) => {
        if (isDefined(article?.image?.id)) {
          this.store.dispatch(
            ImagesActions.fetchArticleBannerImageRequested({ imageId: article.image.id }),
          );
        }

        if (article?.title && article?.body) {
          const articlePreview =
            article.body.length > 197 ? article.body.slice(0, 197) + '...' : article.body;
          this.metaAndTitleService.updateTitle(article.title);
          this.metaAndTitleService.updateDescription(articlePreview);
        }
      });
  }

  public getAdminControlsConfig(article: Article): AdminControlsConfig {
    return {
      buttonSize: 34,
      deleteCb: () => this.onDelete(article),
      editPath: ['article', 'edit', article.id!],
      itemName: article.title,
    };
  }

  private async onDelete(article: Article): Promise<void> {
    const dialog: Dialog = {
      title: 'Delete article',
      body: `Update ${article.title}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        isModal: true,
        inputs: { dialog },
      },
    );

    if (result === 'confirm') {
      this.store.dispatch(ArticlesActions.deleteArticleRequested({ article }));
    }
  }
}
