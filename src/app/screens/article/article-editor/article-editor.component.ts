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
  selector: 'lcc-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss'],
  imports: [ArticleFormComponent, CommonModule, LinkListComponent, ScreenHeaderComponent],
})
export class ArticleEditorComponent implements OnInit {
  public readonly articleEditorViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleEditorViewModel,
  );

  public links: Link[] = [
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
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    this.articleEditorViewModel$
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
