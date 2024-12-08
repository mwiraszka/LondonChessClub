import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleFormComponent } from '@app/components/article-form/article-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';
import { type Link, NavPathTypes } from '@app/types';

import { ArticleEditorFacade } from './article-editor.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss'],
  providers: [ArticleEditorFacade],
  imports: [ArticleFormComponent, CommonModule, LinkListComponent, ScreenHeaderComponent],
})
export class ArticleEditorComponent implements OnInit {
  links: Link[] = [
    {
      icon: 'activity',
      path: NavPathTypes.NEWS,
      text: 'More articles',
    },
    {
      icon: 'home',
      path: NavPathTypes.HOME,
      text: 'Return home',
    },
  ];

  constructor(
    public facade: ArticleEditorFacade,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.facade.setArticleTitle$, this.facade.controlMode$])
      .pipe(untilDestroyed(this))
      .subscribe(([articleTitle, controlMode]) => {
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
