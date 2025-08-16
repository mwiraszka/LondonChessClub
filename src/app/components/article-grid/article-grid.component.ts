import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import {
  AdminControlsConfig,
  Article,
  BasicDialogResult,
  DataPaginationOptions,
  Dialog,
  Id,
  Image,
  NgChanges,
} from '@app/models';
import {
  FormatDatePipe,
  IsDefinedPipe,
  RouterLinkPipe,
  StripMarkdownPipe,
} from '@app/pipes';
import { DialogService } from '@app/services';
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
    MatIconModule,
    RouterLink,
    RouterLinkPipe,
    StripMarkdownPipe,
  ],
})
export class ArticleGridComponent implements OnChanges {
  @Input({ required: true }) articles!: Article[];
  @Input({ required: true }) articleImages!: Image[];
  @Input({ required: true }) isAdmin!: boolean;

  @Input() articleCount?: number;
  @Input() options?: DataPaginationOptions<Article>;

  @Output() public requestDeleteArticle = new EventEmitter<Article>();
  @Output() public requestUpdateArticleBookmark = new EventEmitter<{
    articleId: Id;
    bookmark: boolean;
  }>();

  // TODO: Base on grid container width instead of screen width for better flexibility
  @HostBinding('class')
  public get gridClass(): string {
    return `card-count-${this.articles.length}`;
  }

  private bannerImagesMap = new Map<Id, Image>();

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  // TODO: Integrate into article fetch effect to prevent duplication in all screens that display
  // articles, and to be able to shed the last dependency on NgRx store in this component
  public ngOnChanges(changes: NgChanges<ArticleGridComponent>): void {
    if (changes.articles && this.articles.length) {
      this.store
        .select(ImagesSelectors.selectLastArticleImagesFetch)
        .pipe(take(1))
        .subscribe(lastFetch => {
          if (!lastFetch || isSecondsInPast(lastFetch, 600)) {
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

    if (changes.articleImages) {
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
      this.requestDeleteArticle.emit(article);
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
      this.requestUpdateArticleBookmark.emit({
        articleId: article.id!,
        bookmark: !hasBookmark,
      });
    }
  }
}
