import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import IconsModule from '@app/icons';
import type {
  AdminControlsConfig,
  Article,
  BasicDialogResult,
  Dialog,
  Id,
  Image,
  InternalLink,
  Url,
} from '@app/models';
import {
  FormatDatePipe,
  IsDefinedPipe,
  RouterLinkPipe,
  StripMarkdownPipe,
  WasEditedPipe,
} from '@app/pipes';
import { DialogService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { isDefined } from '@app/utils';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrl: './article-grid.component.scss',
  imports: [
    AdminControlsDirective,
    CommonModule,
    FormatDatePipe,
    IconsModule,
    ImagePreloadDirective,
    IsDefinedPipe,
    LinkListComponent,
    RouterLink,
    RouterLinkPipe,
    StripMarkdownPipe,
    WasEditedPipe,
  ],
})
export class ArticleGridComponent implements OnInit {
  @Input() public maxArticles?: number;

  public viewModel$?: Observable<{
    articles: Article[];
    thumbnailImages: Image[];
    isAdmin: boolean;
  }>;

  public readonly createArticleLink: InternalLink = {
    internalPath: ['article', 'add'],
    text: 'Create an article',
    icon: 'plus-circle',
  };

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(ArticlesActions.fetchArticlesRequested());
    this.store.dispatch(ImagesActions.fetchImageThumbnailsRequested());

    this.viewModel$ = combineLatest([
      this.store.select(ArticlesSelectors.selectAllArticles),
      this.store.select(ImagesSelectors.selectThumbnailImages),
      this.store.select(AuthSelectors.selectIsAdmin),
    ]).pipe(
      map(([articles, thumbnailImages, isAdmin]) => ({
        articles,
        thumbnailImages,
        isAdmin,
      })),
    );
  }

  public getArticleThumbnailImageUrl(
    imageId: Id | null,
    thumbnailImages: Image[],
  ): Url | null {
    return (
      thumbnailImages.find(image => image.id === `${imageId}-thumb`)?.presignedUrl ?? null
    );
  }

  public getAdminControlsConfig(article: Article): AdminControlsConfig {
    return {
      bookmarkCb: () => this.onBookmarkArticle(article),
      bookmarked: isDefined(article.bookmarkDate),
      buttonSize: 34,
      deleteCb: () => this.onDeleteArticle(article),
      editPath: ['article', 'edit', article.id],
      itemName: article.title,
    };
  }

  public async onDeleteArticle(article: Article): Promise<void> {
    const dialog: Dialog = {
      title: 'Delete article',
      body: `Delete ${article.title}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        inputs: { dialog },
        isModal: true,
      },
    );

    if (result === 'confirm') {
      this.store.dispatch(ArticlesActions.deleteArticleRequested({ article }));
    }
  }

  public async onBookmarkArticle(article: Article): Promise<void> {
    const hasBookmark = isDefined(article.bookmarkDate);
    const dialog: Dialog = {
      title: hasBookmark ? 'Remove bookmark' : 'Add bookmark',
      body: hasBookmark
        ? `Remove bookmark from article ${article.title}?`
        : `Bookmark ${article.title}? This will make the article show up first in the list of articles.`,
      confirmButtonText: hasBookmark ? 'Remove' : 'Bookmark',
      confirmButtonType: 'primary',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        inputs: { dialog },
        isModal: true,
      },
    );

    if (result === 'confirm') {
      this.store.dispatch(
        ArticlesActions.updateActicleBookmarkRequested({
          articleId: article.id!,
          bookmark: !hasBookmark,
        }),
      );
    }
  }
}
