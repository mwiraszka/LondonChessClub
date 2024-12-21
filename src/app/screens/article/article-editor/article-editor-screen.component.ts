import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleFormComponent } from '@app/components/article-form/article-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';
import { ArticlesSelectors } from '@app/store/articles';
import { type Link, NavPathTypes } from '@app/types';

@UntilDestroy()
@Component({
  selector: 'lcc-article-editor-screen',
  templateUrl: './article-editor-screen.component.html',
  imports: [ArticleFormComponent, CommonModule, LinkListComponent, ScreenHeaderComponent],
})
export class ArticleEditorScreenComponent implements OnInit {
  public readonly articleEditorScreenViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleEditorScreenViewModel,
  );
  public readonly links: Link[] = [
    {
      icon: 'activity',
      path: NavPathTypes.NEWS,
      text: 'See all articles',
    },
    {
      icon: 'home',
      path: NavPathTypes.HOME,
      text: 'Return home',
    },
  ];

  constructor(
    private readonly store: Store,
    private readonly metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    this.articleEditorScreenViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ articleTitle, controlMode }) => {
        const screenTitle =
          controlMode === 'edit' && articleTitle
            ? `Edit ${articleTitle}`
            : 'Compose an article';
        this.metaAndTitleService.updateTitle(screenTitle);
        this.metaAndTitleService.updateDescription(
          `${screenTitle} for the London Chess Club.`,
        );
      });
  }
}
