import { MarkdownModule } from 'ngx-markdown';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

import { ArticleFormComponent } from './article-form.component';

@NgModule({
  declarations: [ArticleFormComponent],
  imports: [
    CommonModule,
    IconsModule,
    MarkdownModule,
    PipesModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  exports: [ArticleFormComponent],
})
export class ArticleFormModule {}
