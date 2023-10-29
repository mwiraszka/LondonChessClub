import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminControlsModule } from '@app/components/admin-controls';
import { ArticleModule } from '@app/components/article';

import { ArticleViewerScreenComponent } from './article-viewer-screen.component';

@NgModule({
  declarations: [ArticleViewerScreenComponent],
  imports: [AdminControlsModule, ArticleModule, CommonModule],
  exports: [ArticleViewerScreenComponent],
})
export class ArticleViewerScreenModule {}
