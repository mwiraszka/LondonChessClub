import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipesModule } from '@app/pipes';

import { ScreenHeaderModule } from '../screen-header';
import { ArticleComponent } from './article.component';

@NgModule({
  declarations: [ArticleComponent],
  imports: [CommonModule, PipesModule, ScreenHeaderModule],
  exports: [ArticleComponent],
})
export class ArticleModule {}
