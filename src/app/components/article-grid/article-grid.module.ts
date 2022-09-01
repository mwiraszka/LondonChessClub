import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminControlsModule } from '@app/components/admin-controls';
import { LinkListModule } from '@app/components/link-list';
import { TooltipModule } from '@app/components/tooltip';

import { ArticleGridComponent } from './article-grid.component';

@NgModule({
  declarations: [ArticleGridComponent],
  imports: [AdminControlsModule, CommonModule, LinkListModule, TooltipModule],
  exports: [ArticleGridComponent],
})
export class ArticleGridModule {}
