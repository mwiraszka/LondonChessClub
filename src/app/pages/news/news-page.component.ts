import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { Article, Image } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesSelectors } from '@app/store/articles';
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
      <lcc-article-grid
        [articles]="vm.allArticles"
        [articleImages]="vm.articleImages"
        [isAdmin]="vm.isAdmin">
      </lcc-article-grid>
    }
  `,
  imports: [ArticleGridComponent, CommonModule, PageHeaderComponent],
})
export class NewsPageComponent implements OnInit {
  public viewModel$?: Observable<{
    allArticles: Article[];
    articleImages: Image[];
    isAdmin: boolean;
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
      this.store.select(ArticlesSelectors.selectAllArticles),
      this.store.select(ImagesSelectors.selectArticleImages),
      this.store.select(AuthSelectors.selectIsAdmin),
    ]).pipe(
      untilDestroyed(this),
      map(([allArticles, articleImages, isAdmin]) => ({
        allArticles,
        articleImages,
        isAdmin,
      })),
    );
  }
}
