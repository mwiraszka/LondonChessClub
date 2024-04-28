import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminControlsModule } from '@app/components/admin-controls';
import { ArticleModule } from '@app/components/article';
import { LinkListModule } from '@app/components/link-list';

import { ArticleViewerComponent } from './article-viewer.component';

@NgModule({
  declarations: [ArticleViewerComponent],
  imports: [AdminControlsModule, ArticleModule, CommonModule, LinkListModule],
  exports: [ArticleViewerComponent],
})
export class ArticleViewerModule {}
