import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import type {
  AdminControlsConfig,
  Article,
  BasicDialogResult,
  Dialog,
  Id,
  Image,
  InternalLink,
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
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { isDefined, isSecondsInPast } from '@app/utils';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrl: './article-grid.component.scss',
  imports: [
    AdminControlsDirective,
    FormatDatePipe,
    ImagePreloadDirective,
    IsDefinedPipe,
    LinkListComponent,
    MatIconModule,
    RouterLink,
    RouterLinkPipe,
    StripMarkdownPipe,
    WasEditedPipe,
  ],
})
export class ArticleGridComponent implements OnInit, OnChanges {
  @Input({ required: true }) articles!: Article[];
  @Input({ required: true }) articleImages!: Image[];
  @Input({ required: true }) isAdmin!: boolean;

  @Input() public maxArticles?: number;

  private bannerImagesMap = new Map<Id, Image>();

  public readonly createArticleLink: InternalLink = {
    internalPath: ['article', 'add'],
    text: 'Create an article',
    icon: 'add_circle_outline',
  };

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.store
      .select(ArticlesSelectors.selectLastFetch)
      .pipe(take(1))
      .subscribe(lastFetch => {
        if (!lastFetch || isSecondsInPast(lastFetch, 1800)) {
          this.store.dispatch(ArticlesActions.fetchArticlesRequested());
        }
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['articles'] && this.articles.length) {
      this.store
        .select(ImagesSelectors.selectLastArticleImagesFetch)
        .pipe(take(1))
        .subscribe(lastFetch => {
          if (!lastFetch || isSecondsInPast(lastFetch, 1800)) {
            const bannerImageIds = this.articles.map(article => article.bannerImageId);
            this.store.dispatch(
              ImagesActions.fetchBatchThumbnailsRequested({
                imageIds: bannerImageIds,
                context: 'articles',
              }),
            );
          }
        });
    }

    if (changes['articleImages']) {
      this.bannerImagesMap.clear();
      this.articleImages.forEach(image => {
        this.bannerImagesMap.set(image.id, image);
      });
    }
  }

  public getBannerImage(imageId: Id): Partial<Image> | null {
    return this.bannerImagesMap.get(imageId) || { id: imageId, caption: 'Loading...' };
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
      title: 'Confirm',
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
      title: 'Confirm',
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
