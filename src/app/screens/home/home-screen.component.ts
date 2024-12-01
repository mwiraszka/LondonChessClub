import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';
import { type Link, NavPathTypes } from '@app/types';
import { ClubSummaryComponent } from '../../components/club-summary/club-summary.component';
import { ScheduleComponent } from '../../components/schedule/schedule.component';
import { LinkListComponent } from '../../components/link-list/link-list.component';
import { ArticleGridComponent } from '../../components/article-grid/article-grid.component';
import { PhotoGridComponent } from '../../components/photo-grid/photo-grid.component';

@Component({
    selector: 'lcc-home-screen',
    templateUrl: './home-screen.component.html',
    styleUrls: ['./home-screen.component.scss'],
    standalone: true,
    imports: [
        ClubSummaryComponent,
        ScheduleComponent,
        LinkListComponent,
        ArticleGridComponent,
        PhotoGridComponent,
    ],
})
export class HomeScreenComponent implements OnInit {
  scheduleLink: Link = {
    path: NavPathTypes.SCHEDULE,
    text: 'All scheduled events',
  };

  photoGalleryLink: Link = {
    path: NavPathTypes.PHOTO_GALLERY,
    text: 'More photos',
  };

  newsLink: Link = {
    path: NavPathTypes.NEWS,
    text: 'More news',
  };

  constructor(private metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('London Chess Club');
    this.metaAndTitleService.updateDescription(
      `The London Chess Club is open to players of all ages and abilities. We host
      regular blitz and rapid chess tournaments, as well as a variety of lectures, simuls
      and team competitions.`,
    );
  }
}
