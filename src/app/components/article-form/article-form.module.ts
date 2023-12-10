import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MarkdownRendererModule } from '@app/components/markdown-renderer';
import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

import { ModificationInfoModule } from '../modification-info';
import { ArticleFormComponent } from './article-form.component';

@NgModule({
  declarations: [ArticleFormComponent],
  imports: [
    CommonModule,
    IconsModule,
    MarkdownRendererModule,
    ModificationInfoModule,
    PipesModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  exports: [ArticleFormComponent],
})
export class ArticleFormModule {}
