import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArticleFormModule } from '@app/components/article-form';
import { LinkListModule } from '@app/components/link-list';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { ArticleEditorScreenComponent } from './article-editor-screen.component';

@NgModule({
  declarations: [ArticleEditorScreenComponent],
  imports: [ArticleFormModule, CommonModule, LinkListModule, ScreenHeaderModule],
  exports: [ArticleEditorScreenComponent],
})
export class ArticleEditorScreenModule {}
