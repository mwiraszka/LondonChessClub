import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';
import { type Link, NavPathTypes } from '@app/types';

import { ArticleEditorFacade } from './article-editor.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss'],
  providers: [ArticleEditorFacade],
})
export class ArticleEditorComponent implements OnInit {
  links: Link[] = [
    {
      path: NavPathTypes.NEWS,
      text: 'Return to articles',
    },
    {
      path: NavPathTypes.HOME,
      text: 'Return to home page',
    },
  ];

  constructor(
    public facade: ArticleEditorFacade,
    private metaAndTitleService: MetaAndTitleService
  ) {}

  ngOnInit(): void {
    combineLatest([this.facade.selectedArticleTitle$, this.facade.isEditMode$])
      .pipe(untilDestroyed(this))
      .subscribe(([articleTitle, isEditMode]) => {
        const screenTitle =
          isEditMode && articleTitle ? `Edit ${articleTitle}` : 'Compose an article';
        this.metaAndTitleService.updateTitle(screenTitle);
        this.metaAndTitleService.updateDescription(
          `${screenTitle} for the London Chess Club.`
        );
      });
  }
}
