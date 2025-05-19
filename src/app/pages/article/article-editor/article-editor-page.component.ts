import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ArticleFormComponent } from '@app/components/article-form/article-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { Article, ArticleFormData, Image, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesSelectors } from '@app/store/articles';

@UntilDestroy()
@Component({
  selector: 'lcc-article-editor-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [title]="vm.pageTitle">
      </lcc-page-header>
      <lcc-article-form
        [bannerImage]="vm.bannerImage ?? null"
        [formData]="vm.formData"
        [originalArticle]="vm.originalArticle"
        [hasUnsavedChanges]="vm.hasUnsavedChanges">
      </lcc-article-form>
      <lcc-link-list [links]="links"></lcc-link-list>
    }
  `,
  imports: [ArticleFormComponent, CommonModule, LinkListComponent, PageHeaderComponent],
})
export class ArticleEditorPageComponent implements OnInit {
  public viewModel$?: Observable<{
    bannerImage?: Image | null;
    formData: ArticleFormData;
    hasUnsavedChanges: boolean;
    originalArticle: Article | null;
    pageTitle: string;
  }>;

  public readonly links: InternalLink[] = [
    {
      text: 'See all articles',
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
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.viewModel$ = this.activatedRoute.params.pipe(
      untilDestroyed(this),
      map(params => (params['article_id'] ?? null) as string | null),
      switchMap(id =>
        this.store.select(ArticlesSelectors.selectArticleEditorPageViewModel(id)),
      ),
      map(viewModel => ({
        ...viewModel,
        pageTitle: viewModel.originalArticle?.title
          ? `Edit ${viewModel.originalArticle.title}`
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
}
