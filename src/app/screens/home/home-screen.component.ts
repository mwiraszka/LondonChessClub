import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { ClubSummaryComponent } from '@app/components/club-summary/club-summary.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PhotoGridComponent } from '@app/components/photo-grid/photo-grid.component';
import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import { MetaAndTitleService } from '@app/services';
import type { InternalLink } from '@app/types';

@Component({
  selector: 'lcc-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss',
  imports: [
    ArticleGridComponent,
    ClubSummaryComponent,
    CommonModule,
    LinkListComponent,
    PhotoGridComponent,
    ScheduleComponent,
  ],
})
export class HomeScreenComponent implements OnInit {
  public readonly scheduleLink: InternalLink = {
    text: 'All scheduled events',
    internalPath: 'schedule',
  };

  public readonly photoGalleryLink: InternalLink = {
    text: 'More photos',
    internalPath: 'photo-gallery',
  };

  public readonly newsLink: InternalLink = {
    text: 'More news',
    internalPath: 'news',
  };

  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('London Chess Club');
    this.metaAndTitleService.updateDescription(
      `The London Chess Club is open to players of all ages and abilities. We host
      regular blitz and rapid chess tournaments, as well as a variety of lectures, simuls
      and team competitions.`,
    );
  }
}
