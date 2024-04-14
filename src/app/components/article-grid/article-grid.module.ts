import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminControlsModule } from '@app/components/admin-controls';
import { ImagePreloadModule } from '@app/components/image-preload';
import { LinkListModule } from '@app/components/link-list';
import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

import { ArticleGridComponent } from './article-grid.component';

@NgModule({
  declarations: [ArticleGridComponent],
  imports: [
    AdminControlsModule,
    CommonModule,
    IconsModule,
    ImagePreloadModule,
    LinkListModule,
    PipesModule,
    RouterModule,
    TooltipModule,
  ],
  exports: [ArticleGridComponent],
})
export class ArticleGridModule {}
