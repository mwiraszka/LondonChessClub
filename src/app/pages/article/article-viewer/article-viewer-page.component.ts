import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    @if (article && isAdmin !== undefined) {
      <lcc-article
        [adminControls]="isAdmin ? getAdminControlsConfig(article) : null"
        [article]="article"
        [bannerImage]="null">
      </lcc-article>
      <lcc-link-list [links]="links"></lcc-link-list>
    }
  `,
  imports: [AdminControlsDirective, ArticleComponent, CommonModule, LinkListComponent],
})
export class ArticleViewerPageComponent implements OnInit {
  public article?: Article;
  public isAdmin?: boolean;
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

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        untilDestroyed(this),
        map(params => params['article_id'] as string | undefined),
        filter(articleId => isDefined(articleId)),
        switchMap(articleId =>
          this.store.select(
            ArticlesSelectors.selectArticleViewerPageViewModel(articleId),
          ),
        ),
        filter(vm => isDefined(vm.article)),
      )
      .subscribe(vm => {
        if (isDefined(vm.article!.bannerImageId)) {
          this.store.dispatch(
            ImagesActions.fetchArticleBannerImageRequested({
              imageId: vm.article!.bannerImageId,
            }),
          );
        }

        const articlePreview =
          vm.article!.body.length > 197
            ? vm.article!.body.slice(0, 197) + '...'
            : vm.article!.body;
        this.metaAndTitleService.updateTitle(vm.article!.title);
        this.metaAndTitleService.updateDescription(articlePreview);
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
      this.store.dispatch(
        ArticlesActions.deleteArticleRequested({ articleId: article.id }),
      );
    }
  }
}
