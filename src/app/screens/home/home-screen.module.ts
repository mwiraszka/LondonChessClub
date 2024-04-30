import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ArticleGridModule } from '@app/components/article-grid';
import { ClubSummaryModule } from '@app/components/club-summary';
import { LinkListModule } from '@app/components/link-list';
import { PhotoGridModule } from '@app/components/photo-grid';
import { ScheduleModule } from '@app/components/schedule';

import { HomeScreenRoutingModule } from './home-screen-routing.module';
import { HomeScreenComponent } from './home-screen.component';

@NgModule({
  declarations: [HomeScreenComponent],
  imports: [
    ArticleGridModule,
    ClubSummaryModule,
    CommonModule,
    HomeScreenRoutingModule,
    LinkListModule,
    RouterModule,
    PhotoGridModule,
    ScheduleModule,
  ],
  exports: [HomeScreenComponent],
})
export class HomeScreenModule {}
