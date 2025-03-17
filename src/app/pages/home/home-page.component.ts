import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { ClubLinksComponent } from '@app/components/club-links/club-links.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PhotoGridComponent } from '@app/components/photo-grid/photo-grid.component';
import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import type { InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [
    ArticleGridComponent,
    ClubLinksComponent,
    CommonModule,
    LinkListComponent,
    PhotoGridComponent,
    RouterLink,
    ScheduleComponent,
  ],
})
export class HomePageComponent implements OnInit {
  public readonly aboutLink: InternalLink = {
    text: 'More about the London Chess Club',
    internalPath: 'about',
  };

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

