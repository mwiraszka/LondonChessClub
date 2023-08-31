import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from '@app/components/tooltip';

import { ArticleFormComponent } from './article-form.component';

@NgModule({
  declarations: [ArticleFormComponent],
  imports: [CommonModule, ReactiveFormsModule, TooltipModule],
  exports: [ArticleFormComponent],
})
export class ArticleFormModule {}
