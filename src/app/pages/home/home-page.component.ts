import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { AdminToolbarComponent } from '@app/components/admin-toolbar/admin-toolbar.component';
import { ArticleGridComponent } from '@app/components/article-grid/article-grid.component';
import { ClubLinksComponent } from '@app/components/club-links/club-links.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PhotoGridComponent } from '@app/components/photo-grid/photo-grid.component';
import { ScheduleListComponent } from '@app/components/schedule-list/schedule-list.component';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { Article, Event, Id, Image, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { EventsActions, EventsSelectors } from '@app/store/events';
import { ImagesActions, ImagesSelectors } from '@app/store/images';

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
    ScheduleListComponent,
    TooltipDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  public viewModel$?: Observable<{
    allImages: Image[];
    homePageArticles: Article[];
    homePageEvents: Event[];
    isAdmin: boolean;
    nextEvent: Event | null;
    photoImages: Image[];
  }>;

  public aboutPageLink: InternalLink = {
    text: 'More about the London Chess Club',
    internalPath: 'about',
  };
  public readonly addEventLink: InternalLink = {
    text: 'Add an event',
    internalPath: ['event', 'add'],
    icon: 'add_circle_outline',
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

    this.viewModel$ = combineLatest([
      this.store.select(ArticlesSelectors.selectHomePageArticles),
      this.store.select(EventsSelectors.selectHomePageEvents),
      this.store.select(ImagesSelectors.selectAllImages),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(EventsSelectors.selectNextEvent),
    ]).pipe(
      untilDestroyed(this),
      map(([homePageArticles, homePageEvents, allImages, isAdmin, nextEvent]) => ({
        homePageArticles,
        homePageEvents,
        allImages,
        isAdmin,
        nextEvent,
        photoImages: allImages.filter(image => !image.album.startsWith('_')),
      })),
    );
  }

  public onRequestDeleteAlbum(album: string): void {
    this.store.dispatch(ImagesActions.deleteAlbumRequested({ album }));
  }

  public onRequestDeleteArticle(article: Article): void {
    this.store.dispatch(ArticlesActions.deleteArticleRequested({ article }));
  }

  public onRequestDeleteEvent(event: Event): void {
    this.store.dispatch(EventsActions.deleteEventRequested({ event }));
  }

  public onRequestUpdateArticleBookmark(event: {
    articleId: Id;
    bookmark: boolean;
  }): void {
    this.store.dispatch(ArticlesActions.updateArticleBookmarkRequested(event));
  }
}
