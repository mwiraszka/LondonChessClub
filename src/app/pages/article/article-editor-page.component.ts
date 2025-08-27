import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ArticleFormComponent } from '@app/components/article-form/article-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { Article, ArticleFormData, EditorPage, Image, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { ImagesActions, ImagesSelectors } from '@app/store/images';

@UntilDestroy()
@Component({
  selector: 'lcc-article-editor-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        icon="admin_panel_settings"
        [title]="vm.pageTitle">
      </lcc-page-header>

      <lcc-article-form
        [bannerImage]="vm.bannerImage"
        [formData]="vm.formData"
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [originalArticle]="vm.originalArticle"
        (cancel)="onCancel()"
        (change)="onChange($event.articleId, $event.formData)"
        (requestFetchMainImage)="onRequestFetchMainImage($event)"
        (requestPublishArticle)="onRequestPublishArticle()"
        (requestUpdateArticle)="onRequestUpdateArticle($event)"
        (restore)="onRestore($event)">
      </lcc-article-form>

      <lcc-link-list [links]="[newsPageLink]"></lcc-link-list>
    }
  `,
  imports: [ArticleFormComponent, CommonModule, LinkListComponent, PageHeaderComponent],
})
export class ArticleEditorPageComponent implements EditorPage, OnInit {
  public readonly entity = 'article';
  public readonly newsPageLink: InternalLink = {
    text: 'See all articles',
    internalPath: 'news',
    icon: 'map',
  };
  public viewModel$?: Observable<{
    bannerImage: Image | null;
    formData: ArticleFormData;
    hasUnsavedChanges: boolean;
    originalArticle: Article | null;
    pageTitle: string;
  }>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.viewModel$ = this.activatedRoute.params.pipe(
      untilDestroyed(this),
      map(params => (params['article_id'] ?? null) as string | null),
      switchMap(articleId =>
        combineLatest([
          this.store.select(ArticlesSelectors.selectArticleById(articleId)),
          this.store.select(ArticlesSelectors.selectArticleFormDataById(articleId)),
          this.store.select(ArticlesSelectors.selectHasUnsavedChanges(articleId)),
          this.store.select(ImagesSelectors.selectImageByArticleId(articleId)),
        ]),
      ),
      map(([originalArticle, formData, hasUnsavedChanges, bannerImage]) => ({
        originalArticle,
        formData,
        hasUnsavedChanges,
        bannerImage,
        pageTitle: originalArticle
          ? `Edit ${originalArticle.title}`
          : 'Compose an article',
      })),
      tap(viewModel => {
        this.metaAndTitleService.updateTitle(viewModel.pageTitle);
        this.metaAndTitleService.updateDescription(
          `${viewModel.pageTitle} for the London Chess Club.`,
        );
      }),
    );
  }

  public onCancel(): void {
    this.store.dispatch(ArticlesActions.cancelSelected());
  }

  public onChange(articleId: string | null, formData: Partial<ArticleFormData>): void {
    this.store.dispatch(ArticlesActions.formDataChanged({ articleId, formData }));
  }

  public onRequestFetchMainImage(imageId: string): void {
    this.store.dispatch(ImagesActions.fetchMainImageRequested({ imageId }));
  }

  public onRequestPublishArticle(): void {
    this.store.dispatch(ArticlesActions.publishArticleRequested());
  }

  public onRequestUpdateArticle(articleId: string): void {
    this.store.dispatch(ArticlesActions.updateArticleRequested({ articleId }));
  }

  public onRestore(articleId: string | null): void {
    this.store.dispatch(ArticlesActions.formDataRestored({ articleId }));
  }
}
