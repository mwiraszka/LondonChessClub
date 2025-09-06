import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, take } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MOCK_ARTICLES } from '@app/mocks/articles.mock';
import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { Article, Event, Image } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { EventsActions, EventsSelectors } from '@app/store/events';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { query, queryAll } from '@app/utils';

import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;

  let metaAndTitleService: MetaAndTitleService;
  let store: MockStore;

  let dispatchSpy: jest.SpyInstance;
  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  const mockArticles = MOCK_ARTICLES.slice(0, 3);
  const mockEvents = MOCK_EVENTS.slice(0, 3);
  const mockImages: Image[] = [
    ...MOCK_IMAGES.slice(0, 2),
    { ...MOCK_IMAGES[2], id: 'abc123', album: '_internal' },
  ];
  const mockIsAdmin = true;
  const mockNextEvent = MOCK_EVENTS[0];
  const mockShowPastEvents = false;
  const mockUpcomingEvents = MOCK_EVENTS.slice(0, 2);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        {
          provide: MetaAndTitleService,
          useValue: {
            updateTitle: jest.fn(),
            updateDescription: jest.fn(),
          },
        },
        provideMockStore(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;

    metaAndTitleService = TestBed.inject(MetaAndTitleService);
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');
    updateDescriptionSpy = jest.spyOn(metaAndTitleService, 'updateDescription');
    updateTitleSpy = jest.spyOn(metaAndTitleService, 'updateTitle');

    store.overrideSelector(ArticlesSelectors.selectHomePageArticles, mockArticles);
    store.overrideSelector(EventsSelectors.selectAllEvents, mockEvents);
    store.overrideSelector(ImagesSelectors.selectAllImages, mockImages);
    store.overrideSelector(AuthSelectors.selectIsAdmin, mockIsAdmin);
    store.overrideSelector(EventsSelectors.selectNextEvent, mockNextEvent);
    store.refreshState();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set meta title and description', () => {
      expect(updateTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateTitleSpy).toHaveBeenCalledWith('London Chess Club');
      expect(updateDescriptionSpy).toHaveBeenCalledTimes(1);
    });

    it('should set viewModel$ with expected data', async () => {
      const vm = await firstValueFrom(component.viewModel$!.pipe(take(1)));
      const expectedPhotoImages = mockImages.filter(
        image => !image.album.startsWith('_'),
      );

      expect(vm).toStrictEqual({
        articles: mockArticles,
        events: mockEvents,
        images: mockImages,
        isAdmin: mockIsAdmin,
        nextEvent: mockNextEvent,
        photoImages: expectedPhotoImages,
        showPastEvents: mockShowPastEvents,
        upcomingEvents: mockUpcomingEvents,
      });
    });
  });

  describe('onRequestDeleteAlbum', () => {
    it('should dispatch deleteAlbumRequested action', () => {
      const album = 'Album X';
      component.onRequestDeleteAlbum(album);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ImagesActions.deleteAlbumRequested({ album }),
      );
    });
  });

  describe('onRequestDeleteArticle', () => {
    it('should dispatch deleteArticleRequested action', () => {
      const article: Article = mockArticles[0];
      component.onRequestDeleteArticle(article);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ArticlesActions.deleteArticleRequested({ article }),
      );
    });
  });

  describe('onRequestDeleteEvent', () => {
    it('should dispatch deleteEventRequested action', () => {
      const event: Event = mockEvents[0];
      component.onRequestDeleteEvent(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        EventsActions.deleteEventRequested({ event }),
      );
    });
  });

  describe('onRequestUpdateArticleBookmark', () => {
    it('should dispatch updateArticleBookmarkRequested action', () => {
      const payload = {
        articleId: mockArticles[0].id,
        bookmark: true,
      };
      component.onRequestUpdateArticleBookmark(payload);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ArticlesActions.updateArticleBookmarkRequested(payload),
      );
    });
  });

  describe('template rendering', () => {
    describe('when viewModel$ is undefined', () => {
      it('should not render any content', () => {
        expect(query(fixture.debugElement, '.welcome-section')).toBeFalsy();
        expect(query(fixture.debugElement, '.schedule-section')).toBeFalsy();
        expect(query(fixture.debugElement, '.articles-section')).toBeFalsy();
        expect(query(fixture.debugElement, '.regional-clubs-section')).toBeFalsy();
        expect(query(fixture.debugElement, '.photos-section')).toBeFalsy();
      });
    });

    describe('when viewModel$ is defined', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should render all grid sections and their content', () => {
        expect(query(fixture.debugElement, '.welcome-section')).toBeTruthy();

        expect(
          query(fixture.debugElement, '.schedule-section lcc-schedule'),
        ).toBeTruthy();
        expect(
          query(fixture.debugElement, '.schedule-section lcc-link-list'),
        ).toBeTruthy();

        expect(
          query(fixture.debugElement, '.articles-section lcc-article-grid'),
        ).toBeTruthy();
        expect(
          query(fixture.debugElement, '.articles-section lcc-link-list'),
        ).toBeTruthy();

        expect(
          queryAll(fixture.debugElement, '.regional-clubs-section .club-card'),
        ).toHaveLength(2);

        expect(
          query(fixture.debugElement, '.photos-section lcc-photo-grid'),
        ).toBeTruthy();
        expect(query(fixture.debugElement, '.photos-section lcc-link-list')).toBeTruthy();
      });

      it('should render articles section admin toolbar in when admin', () => {
        expect(
          query(fixture.debugElement, '.articles-section lcc-admin-toolbar'),
        ).toBeTruthy();
      });

      it('should not render articles section admin toolbar when not admin', () => {
        store.overrideSelector(AuthSelectors.selectIsAdmin, false);
        store.refreshState();
        fixture.detectChanges();

        expect(
          query(fixture.debugElement, '.articles-section lcc-admin-toolbar'),
        ).toBeFalsy();
      });
    });
  });
});
