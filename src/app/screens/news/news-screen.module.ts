import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArticleGridModule } from '@app/components/article-grid';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { NewsScreenComponent } from './news-screen.component';

@NgModule({
  declarations: [NewsScreenComponent],
  imports: [ArticleGridModule, CommonModule, ScreenHeaderModule],
  exports: [NewsScreenComponent],
})
export class NewsScreenModule {}
