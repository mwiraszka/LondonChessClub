import {
  ChangeDetectionStrategy,
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
  IsoDate,
  NgChanges,
} from '@app/models';
import {
  FormatDatePipe,
  HighlightPipe,
  RouterLinkPipe,
  StripMarkdownPipe,
} from '@app/pipes';
import { DialogService } from '@app/services';
import { isDefined, isExpired } from '@app/utils';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrl: './article-grid.component.scss',
  imports: [
    AdminControlsDirective,
    FormatDatePipe,
    HighlightPipe,
    ImagePreloadDirective,
    MatIconModule,
    RouterLink,
    RouterLinkPipe,
    StripMarkdownPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleGridComponent implements OnChanges {
  @Input({ required: true }) articles!: Article[];
  @Input({ required: true }) images!: Image[];
  @Input({ required: true }) isAdmin!: boolean;
  @Input({ required: true }) lastFetch!: IsoDate | null;
  @Input({ required: true }) options!: DataPaginationOptions<Article>;

  @Output() public requestDeleteArticle = new EventEmitter<Article>();
  @Output() public requestFetch = new EventEmitter<void>();
  @Output() public requestUpdateArticleBookmark = new EventEmitter<{
    articleId: Id;
    bookmark: boolean;
  }>();

  @HostBinding('attr.card-count')
  public get cardCount(): number {
    return this.articles.length;
  }

  private bannerImagesMap = new Map<Id, Image>();

  constructor(private readonly dialogService: DialogService) {}

  public ngOnChanges(changes: NgChanges<ArticleGridComponent>): void {
    if (changes.images) {
      this.bannerImagesMap.clear();
      this.images.forEach(image => {
        this.bannerImagesMap.set(image.id, image);
      });
    }

    if (changes.lastFetch) {
      if (!this.lastFetch || isExpired(this.lastFetch)) {
        this.requestFetch.emit();
      }
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
