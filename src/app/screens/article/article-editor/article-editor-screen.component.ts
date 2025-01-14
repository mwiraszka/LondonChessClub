import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleFormComponent } from '@app/components/article-form/article-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import type { InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesSelectors } from '@app/store/articles';
import { ImagesActions } from '@app/store/images';
import { isDefined } from '@app/utils';

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
    this.articleEditorScreenViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ article, articleTitle, controlMode }) => {
        if (!isDefined(article?.imageUrl) && isDefined(article?.imageId)) {
          this.store.dispatch(
            ImagesActions.fetchArticleBannerImageRequested({ imageId: article.imageId }),
          );
        }

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
