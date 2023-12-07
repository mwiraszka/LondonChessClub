import { MarkdownModule } from 'ngx-markdown';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModificationInfoModule } from '@app/components/modification-info';
import { ScreenHeaderModule } from '@app/components/screen-header';
import { PipesModule } from '@app/pipes';

import { ArticleComponent } from './article.component';

@NgModule({
  declarations: [ArticleComponent],
  imports: [
    CommonModule,
    MarkdownModule,
    ModificationInfoModule,
    PipesModule,
    ScreenHeaderModule,
  ],
  exports: [ArticleComponent],
})
export class ArticleModule {}
