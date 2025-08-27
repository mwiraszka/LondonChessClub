import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { AdminToolbarComponent } from '@app/components/admin-toolbar/admin-toolbar.component';
import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { ClubLinksComponent } from '@app/components/club-links/club-links.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PhotoGridComponent } from '@app/components/photo-grid/photo-grid.component';
import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { Article, DataPaginationOptions, Event, Image, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
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
    AdminToolbarComponent,
    ArticleGridComponent,
    ClubLinksComponent,
    CommonModule,
    LinkListComponent,
    MatIconModule,
    PhotoGridComponent,
    RouterLink,
    ScheduleComponent,
    TooltipDirective,
  ],
})
export class HomePageComponent implements OnInit {
  public viewModel$?: Observable<{
    articles: Article[];
    images: Image[];
    events: Event[];
    isAdmin: boolean;
    nextEvent: Event | null;
    photoImages: Image[];
    showPastEvents: boolean;
    upcomingEvents: Event[];
  }>;

  public aboutPageLink: InternalLink = {
    text: 'More about the London Chess Club',
    internalPath: 'about',
  };
  public createArticleLink: InternalLink = {
    internalPath: ['article', 'add'],
    text: 'Create an article',
    icon: 'add_circle_outline',
  };
  public newsPageLink: InternalLink = {
    text: 'More news',
    internalPath: 'news',
  };
  public photoGalleryPageLink: InternalLink = {
    text: 'More photos',
    internalPath: 'photo-gallery',
  };
  public schedulePageLink: InternalLink = {
    text: 'All scheduled events',
    internalPath: 'schedule',
  };

  // Only passed in for the pageSize; options for API call are set in the effect
  public get articleOptions(): DataPaginationOptions<Article> {
    return {
      page: 1,
      pageSize: this.articleCount,
      sortBy: 'bookmarkDate',
      sortOrder: 'desc',
      filters: {},
      search: '',
    };
  }

  private articleCount!: number;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('London Chess Club');
    this.metaAndTitleService.updateDescription(
      `The London Chess Club is open to players of all ages and abilities. We host
      regular blitz and rapid chess tournaments, as well as a variety of lectures, simuls
      and team competitions.`,
    );
    this.setArticleCountBasedOnScreenWidth();

    this.store
      .select(ArticlesSelectors.selectLastHomePageFetch)
      .pipe(take(1))
      .subscribe(lastFetch => {
        if (!lastFetch || isSecondsInPast(lastFetch, 600)) {
          this.store.dispatch(ArticlesActions.fetchHomePageArticlesRequested());
        }
      });

    this.viewModel$ = combineLatest([
      this.store.select(ArticlesSelectors.selectHomePageArticles),
      this.store.select(ImagesSelectors.selectAllImages),
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
          images,
          events,
          isAdmin,
          nextEvent,
          photoImages,
          showPastEvents,
          upcomingEvents,
        ]) => ({
          articles,
          images,
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
    this.articleCount =
      window.innerWidth < 726
        ? 4
        : window.innerWidth < 952
          ? 6
          : window.innerWidth < 1405
            ? 4
            : 6;
  };
}
