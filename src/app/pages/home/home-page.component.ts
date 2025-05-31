import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { ClubLinksComponent } from '@app/components/club-links/club-links.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PhotoGridComponent } from '@app/components/photo-grid/photo-grid.component';
import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import type { Article, Event, Image, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { EventsSelectors } from '@app/store/events';
import { ImagesSelectors } from '@app/store/images';

@UntilDestroy()
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
  public readonly aboutPageLink: InternalLink = {
    text: 'More about the London Chess Club',
    internalPath: 'about',
  };
  public maxArticles!: number;
  public readonly photoGalleryPageLink: InternalLink = {
    text: 'More photos',
    internalPath: 'photo-gallery',
  };
  public readonly newsPageLink: InternalLink = {
    text: 'More news',
    internalPath: 'news',
  };
  public readonly schedulePageLink: InternalLink = {
    text: 'All scheduled events',
    internalPath: 'schedule',
  };
  public viewModel$?: Observable<{
    allArticles: Article[];
    articleImages: Image[];
    allEvents: Event[];
    photoImages: Image[];
    isAdmin: boolean;
    nextEvent: Event | null;
    showPastEvents: boolean;
    upcomingEvents: Event[];
  }>;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('London Chess Club');
    this.metaAndTitleService.updateDescription(
      `The London Chess Club is open to players of all ages and abilities. We host
      regular blitz and rapid chess tournaments, as well as a variety of lectures, simuls
      and team competitions.`,
    );
    this.setArticleCountBasedOnScreenWidth();

    this.viewModel$ = combineLatest([
      this.store.select(ArticlesSelectors.selectAllArticles),
      this.store.select(ImagesSelectors.selectArticleImages),
      this.store.select(EventsSelectors.selectAllEvents),
      this.store.select(ImagesSelectors.selectPhotoImages),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(EventsSelectors.selectNextEvent),
      this.store.select(EventsSelectors.selectShowPastEvents),
      this.store.select(EventsSelectors.selectUpcomingEvents),
    ]).pipe(
      untilDestroyed(this),
      map(
        ([
          allArticles,
          articleImages,
          allEvents,
          photoImages,
          isAdmin,
          nextEvent,
          showPastEvents,
          upcomingEvents,
        ]) => ({
          allArticles,
          articleImages,
          allEvents,
          photoImages,
          isAdmin,
          nextEvent,
          showPastEvents,
          upcomingEvents,
        }),
      ),
    );
  }

  @HostListener('window:resize', ['$event'])
  private setArticleCountBasedOnScreenWidth = () => {
    this.maxArticles =
      window.innerWidth < 550
        ? 3
        : window.innerWidth < 930
          ? 4
          : window.innerWidth < 1240
            ? 6
            : window.innerWidth < 1550
              ? 8
              : 10;
  };
}
