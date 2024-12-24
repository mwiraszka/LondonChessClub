import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { ImagePreloadDirective } from '@app/components/image-preload/image-preload.directive';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { ModalComponent } from '@app/components/modal/modal.component';
import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { StripMarkdownPipe } from '@app/pipes/strip-markdown.pipe';
import { DialogService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import {
  type Article,
  type Link,
  type Modal,
  type ModalResult,
  NavPathTypes,
} from '@app/types';
import { wasEdited } from '@app/utils';

@Component({
  selector: 'lcc-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrl: './article-grid.component.scss',
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
  @Input() public maxArticles?: number;

  public readonly NavPathTypes = NavPathTypes;
  public readonly wasEdited = wasEdited;

  public readonly articleGridViewModel$ = this.store.select(
    ArticlesSelectors.selectArticleGridViewModel,
  );
  public readonly createArticleLink: Link = {
    path: NavPathTypes.ARTICLE + '/' + NavPathTypes.ADD,
    text: 'Create an article',
    icon: 'plus-circle',
  };

  constructor(
    private readonly dialogService: DialogService<ModalComponent, ModalResult>,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.fetchArticles();
  }

  public fetchArticles(): void {
    this.store.dispatch(ArticlesActions.fetchArticlesRequested());
  }

  public async onDeleteArticle(article: Article): Promise<void> {
    const modal: Modal = {
      title: 'Confirm article deletion',
      body: `Update ${article.title}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open({
      componentType: ModalComponent,
      inputs: { modal },
    });

    if (result === 'confirm') {
      this.store.dispatch(ArticlesActions.deleteArticleRequested({ article }));
    }
  }
}
