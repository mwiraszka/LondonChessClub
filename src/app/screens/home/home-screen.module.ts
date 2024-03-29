import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutModule } from '@app/components/about';
import { ArticleGridModule } from '@app/components/article-grid';
import { LinkListModule } from '@app/components/link-list';
import { PhotoGridModule } from '@app/components/photo-grid';
import { ScheduleModule } from '@app/components/schedule';

import { HomeScreenComponent } from './home-screen.component';

@NgModule({
  declarations: [HomeScreenComponent],
  imports: [
    AboutModule,
    ArticleGridModule,
    CommonModule,
    LinkListModule,
    RouterModule,
    PhotoGridModule,
    ScheduleModule,
  ],
  exports: [HomeScreenComponent],
})
export class HomeScreenModule {}
