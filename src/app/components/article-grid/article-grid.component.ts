import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminControlsDirective } from '@app/components/admin-controls/admin-controls.directive';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { ImagePreloadDirective } from '@app/components/image-preload/image-preload.directive';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import IconsModule from '@app/icons';
import {
  FormatDatePipe,
  RouterLinkPipe,
  StripMarkdownPipe,
  WasEditedPipe,
} from '@app/pipes';
import { DialogService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import type {
  AdminControlsConfig,
  Article,
  BasicDialogResult,
  Dialog,
  InternalLink,
} from '@app/types';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrl: './article-grid.component.scss',
  imports: [
    AdminControlsDirective,
    CommonModule,
    FormatDatePipe,
    IconsModule,
    ImagePreloadDirective,
    LinkListComponent,
    RouterLink,
    RouterLinkPipe,
    StripMarkdownPipe,
    WasEditedPipe,
  ],
})
export class ArticleGridComponent implements OnInit {
  @Input() public maxArticles?: number;

  public readonly articleGridViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleGridViewModel,
  );
  public readonly createArticleLink: InternalLink = {
    internalPath: ['article', 'add'],
    text: 'Create an article',
    icon: 'plus-circle',
  };

  constructor(
    private readonly dialogService: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  public fetchArticles(): void {
    this.store.dispatch(ArticlesActions.fetchArticlesRequested());
  }

  public getAdminControlsConfig(article: Article): AdminControlsConfig {
    return {
      buttonSize: 28,
      deleteCb: () => this.onDeleteArticle(article),
      editPath: ['article', 'edit', article.id!],
      itemName: article.title,
    };
  }

  public async onDeleteArticle(article: Article): Promise<void> {
    const dialog: Dialog = {
      title: 'Confirm article deletion',
      body: `Delete ${article.title}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    if (result === 'confirm') {
      this.store.dispatch(ArticlesActions.deleteArticleRequested({ article }));
    }
  }
}
