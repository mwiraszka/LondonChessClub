import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AdminToolbarComponent } from '@app/components/admin-toolbar/admin-toolbar.component';
import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { DataToolbarComponent } from '@app/components/data-toolbar/data-toolbar.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import {
  Article,
  DataPaginationOptions,
  Id,
  Image,
  InternalLink,
  IsoDate,
} from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { ImagesSelectors } from '@app/store/images';

@UntilDestroy()
@Component({
  selector: 'lcc-news-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        title="News"
        icon="map">
      </lcc-page-header>

      @if (vm.isAdmin) {
        <lcc-admin-toolbar [adminLinks]="[createArticleLink]"></lcc-admin-toolbar>
      }

      <lcc-data-toolbar
        entity="articles"
        [filteredCount]="vm.filteredCount"
        [options]="vm.options"
        searchPlaceholder="Search by author, title or content"
        (optionsChange)="onOptionsChange($event)"
        (optionsChangeNoFetch)="onOptionsChange($event, false)">
      </lcc-data-toolbar>

      <lcc-article-grid
        [articles]="vm.articles"
        [images]="vm.images"
        [isAdmin]="vm.isAdmin"
        [lastFetch]="vm.lastFetch"
        [options]="vm.options"
        (requestDeleteArticle)="onRequestDeleteArticle($event)"
        (requestFetchArticles)="onRequestFetchArticles()"
        (requestUpdateArticleBookmark)="onRequestUpdateArticleBookmark($event)">
      </lcc-article-grid>
    }
  `,
  imports: [
    AdminToolbarComponent,
    ArticleGridComponent,
    CommonModule,
    DataToolbarComponent,
    PageHeaderComponent,
  ],
})
export class NewsPageComponent implements OnInit {
  public createArticleLink: InternalLink = {
    internalPath: ['article', 'add'],
    text: 'Create an article',
    icon: 'add_circle_outline',
  };

  public viewModel$?: Observable<{
    articles: Article[];
    filteredCount: number | null;
    images: Image[];
    isAdmin: boolean;
    lastFetch: IsoDate | null;
    options: DataPaginationOptions<Article>;
  }>;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('News');
    this.metaAndTitleService.updateDescription(
      'Read about a variety of topics related to the London Chess Club.',
    );

    this.viewModel$ = combineLatest([
      this.store.select(ArticlesSelectors.selectFilteredArticles),
      this.store.select(ArticlesSelectors.selectFilteredCount),
      this.store.select(ImagesSelectors.selectAllImages),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(ArticlesSelectors.selectLastFilteredFetch),
      this.store.select(ArticlesSelectors.selectOptions),
    ]).pipe(
      untilDestroyed(this),
      map(([articles, filteredCount, images, isAdmin, lastFetch, options]) => ({
        articles,
        filteredCount,
        images,
        isAdmin,
        lastFetch,
        options,
      })),
    );
  }

  public onOptionsChange(options: DataPaginationOptions<Article>, fetch = true): void {
    this.store.dispatch(ArticlesActions.paginationOptionsChanged({ options, fetch }));
  }

  public onRequestDeleteArticle(article: Article): void {
    this.store.dispatch(ArticlesActions.deleteArticleRequested({ article }));
  }

  public onRequestFetchArticles(): void {
    this.store.dispatch(ArticlesActions.fetchFilteredArticlesRequested());
  }

  public onRequestUpdateArticleBookmark(event: {
    articleId: Id;
    bookmark: boolean;
  }): void {
    this.store.dispatch(ArticlesActions.updateArticleBookmarkRequested(event));
  }
}
