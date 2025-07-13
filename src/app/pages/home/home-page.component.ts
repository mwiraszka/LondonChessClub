import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

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
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { isSecondsInPast } from '@app/utils';

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
    articles: Article[];
    articleImages: Image[];
    events: Event[];
    isAdmin: boolean;
    nextEvent: Event | null;
    photoImages: Image[];
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
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(EventsSelectors.selectNextEvent),
      this.store.select(ImagesSelectors.selectPhotoImages),
      this.store.select(EventsSelectors.selectShowPastEvents),
      this.store.select(EventsSelectors.selectUpcomingEvents),
    ]).pipe(
      untilDestroyed(this),
      map(
        ([
          articles,
          articleImages,
          events,
          isAdmin,
          nextEvent,
          photoImages,
          showPastEvents,
          upcomingEvents,
        ]) => ({
          articles,
          articleImages,
          events,
          isAdmin,
          nextEvent,
          photoImages,
          showPastEvents,
          upcomingEvents,
        }),
      ),
    );

    this.store
      .select(ImagesSelectors.selectLastMetadataFetch)
      .pipe(take(1))
      .subscribe(lastFetch => {
        if (!lastFetch || isSecondsInPast(lastFetch, 600)) {
          this.store.dispatch(ImagesActions.fetchAllImagesMetadataRequested());
        }
      });
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
