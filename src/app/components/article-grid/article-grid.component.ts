import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as uuid from 'uuid';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { ImagePreloadDirective } from '@app/components/image-preload/image-preload.directive';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { StripMarkdownPipe } from '@app/pipes/strip-markdown.pipe';
import { Article, type Link, NavPathTypes } from '@app/types';
import { wasEdited } from '@app/utils';

import { ArticleGridFacade } from './article-grid.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrls: ['./article-grid.component.scss'],
  providers: [ArticleGridFacade],
  imports: [
    AdminControlsComponent,
    CommonModule,
    FormatDatePipe,
    IconsModule,
    ImagePreloadDirective,
    LinkListComponent,
    RouterLink,
    StripMarkdownPipe,
  ],
})
export class ArticleGridComponent implements OnInit {
  readonly PLACEHOLDER_ARTICLE: Article = {
    id: uuid.v4(),
    title: '',
    body: '',
    imageFile: null,
    imageId: null,
    imageUrl: null,
    thumbnailImageUrl: null,
    isSticky: false,
    modificationInfo: null,
  };

  readonly NavPathTypes = NavPathTypes;
  readonly wasEdited = wasEdited;

  @Input() maxArticles?: number;

  articles!: Article[];
  createArticleLink: Link = {
    path: NavPathTypes.ARTICLE + '/' + NavPathTypes.ADD,
    text: 'Create an article',
    icon: 'plus-circle',
  };

  constructor(public facade: ArticleGridFacade) {}

  ngOnInit(): void {
    this.facade.fetchArticles();
    this.articles = Array(this.maxArticles ?? 20).fill(this.PLACEHOLDER_ARTICLE);

    this.facade.articles$.pipe(untilDestroyed(this)).subscribe(articles => {
      this.articles = articles.slice(0, this.maxArticles ?? articles.length);
    });
  }
}
