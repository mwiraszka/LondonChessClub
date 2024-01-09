import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminControlsModule } from '@app/components/admin-controls';
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
    LinkListModule,
    PipesModule,
    RouterModule,
    TooltipModule,
  ],
  exports: [ArticleGridComponent],
})
export class ArticleGridModule {}
