import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeScreenComponent } from '@app/screens/home';
import { AboutModule } from '@app/shared/components/about';
import { ArticleGridModule } from '@app/shared/components/article-grid';
import { LinkListModule } from '@app/shared/components/link-list';
import { PhotoGridModule } from '@app/shared/components/photo-grid';
import { ScheduleModule } from '@app/shared/components/schedule';

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
