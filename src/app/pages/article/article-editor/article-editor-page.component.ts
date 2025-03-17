import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleFormComponent } from '@app/components/article-form/article-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesSelectors } from '@app/store/articles';

@UntilDestroy()
@Component({
  selector: 'lcc-article-editor-page',
  templateUrl: './article-editor-page.component.html',
  imports: [ArticleFormComponent, CommonModule, LinkListComponent, PageHeaderComponent],
})
export class ArticleEditorPageComponent implements OnInit {
  public readonly articleEditorPageViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleEditorPageViewModel,
  );
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
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.articleEditorPageViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ articleTitle, controlMode }) => {
        const pageTitle =
          controlMode === 'edit' && articleTitle
            ? `Edit ${articleTitle}`
            : 'Compose an article';
        this.metaAndTitleService.updateTitle(pageTitle);
        this.metaAndTitleService.updateDescription(
          `${pageTitle} for the London Chess Club.`,
        );
      });
  }
}
