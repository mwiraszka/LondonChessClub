import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArticleFormModule } from '@app/components/article-form';
import { LinkListModule } from '@app/components/link-list';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { ArticleEditorComponent } from './article-editor.component';

@NgModule({
  declarations: [ArticleEditorComponent],
  imports: [ArticleFormModule, CommonModule, LinkListModule, ScreenHeaderModule],
  exports: [ArticleEditorComponent],
})
export class ArticleEditorModule {}
