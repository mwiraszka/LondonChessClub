import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, take } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MOCK_ARTICLES } from '@app/mocks/articles.mock';
import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { Article, Event, Image } from '@app/models';
import { DialogService, MetaAndTitleService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthSelectors } from '@app/store/auth';
import { EventsActions, EventsSelectors } from '@app/store/events';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { query, queryAll } from '@app/utils';

import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;

  let dialogService: DialogService;
  let metaAndTitleService: MetaAndTitleService;
  let store: MockStore;

  let dialogOpenSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;
  let onExportToCsvSpy: jest.SpyInstance;
  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  const mockHomePageArticles = MOCK_ARTICLES.slice(0, 3);
  const mockHomePageEvents = MOCK_EVENTS.slice(0, 3);
  const mockAllImages: Image[] = [
    ...MOCK_IMAGES.slice(0, 2),
    { ...MOCK_IMAGES[2], id: 'abc123', album: '_internal' },
  ];
  const mockIsAdmin = true;
  const mockNextEvent = MOCK_EVENTS[0];
  const mockPhotoImages = mockAllImages.filter(image => !image.album.startsWith('_'));
  const mockTotalCount = 999;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        { provide: DialogService, useValue: { open: jest.fn() } },

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

    dialogService = TestBed.inject(DialogService);

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;

    metaAndTitleService = TestBed.inject(MetaAndTitleService);
    store = TestBed.inject(MockStore);

    dialogOpenSpy = jest.spyOn(dialogService, 'open');
    dispatchSpy = jest.spyOn(store, 'dispatch');
    onExportToCsvSpy = jest.spyOn(component, 'onExportToCsv');
    updateDescriptionSpy = jest.spyOn(metaAndTitleService, 'updateDescription');
    updateTitleSpy = jest.spyOn(metaAndTitleService, 'updateTitle');

    store.overrideSelector(
      ArticlesSelectors.selectHomePageArticles,
      mockHomePageArticles,
    );
    store.overrideSelector(EventsSelectors.selectHomePageEvents, mockHomePageEvents);
    store.overrideSelector(ImagesSelectors.selectAllImages, mockAllImages);
    store.overrideSelector(AuthSelectors.selectIsAdmin, mockIsAdmin);
    store.overrideSelector(EventsSelectors.selectNextEvent, mockNextEvent);
    store.overrideSelector(EventsSelectors.selectTotalCount, mockTotalCount);
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

      expect(vm).toStrictEqual({
        homePageArticles: mockHomePageArticles,
        homePageEvents: mockHomePageEvents,
        allImages: mockAllImages,
        isAdmin: mockIsAdmin,
        nextEvent: mockNextEvent,
        photoImages: mockPhotoImages,
      });
    });
  });

  describe('onExportToCsv', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return early if event count is zero', async () => {
      store.overrideSelector(EventsSelectors.selectTotalCount, 0);
      store.refreshState();

      await component.onExportToCsv();

      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });

    it('should open confirmation dialog with correct event count', async () => {
      const dialogOpenSpy = jest.spyOn(dialogService, 'open').mockResolvedValue('cancel');

      await component.onExportToCsv();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: expect.any(Function),
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Export all ${mockTotalCount} events to a CSV file?`,
            confirmButtonText: 'Export',
            confirmButtonType: 'primary',
          },
        },
        isModal: false,
      });
    });

    it('should dispatch exportEventsToCsvRequested when dialog is confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');

      await component.onExportToCsv();

      expect(dispatchSpy).toHaveBeenCalledWith(
        EventsActions.exportEventsToCsvRequested(),
      );
    });

    it('should not dispatch exportEventsToCsvRequested when dialog is cancelled', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');

      await component.onExportToCsv();

      expect(dispatchSpy).not.toHaveBeenCalled();
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
      const article: Article = mockHomePageArticles[0];
      component.onRequestDeleteArticle(article);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ArticlesActions.deleteArticleRequested({ article }),
      );
    });
  });

  describe('onRequestDeleteEvent', () => {
    it('should dispatch deleteEventRequested action', () => {
      const event: Event = mockHomePageEvents[0];
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
        articleId: mockHomePageArticles[0].id,
        bookmark: true,
      };
      component.onRequestUpdateArticleBookmark(payload);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        ArticlesActions.updateArticleBookmarkRequested(payload),
      );
    });
  });

  describe('component properties', () => {
    it('should have correct internal link configurations', () => {
      expect(component.aboutPageLink).toStrictEqual({
        text: 'More about the London Chess Club',
        internalPath: 'about',
      });

      expect(component.addEventLink).toStrictEqual({
        text: 'Add an event',
        internalPath: ['event', 'add'],
        icon: 'add_circle_outline',
      });

      expect(component.createArticleLink).toStrictEqual({
        text: 'Create an article',
        internalPath: ['article', 'add'],
        icon: 'add_circle_outline',
      });

      expect(component.newsPageLink).toStrictEqual({
        text: 'More news',
        internalPath: 'news',
      });

      expect(component.photoGalleryPageLink).toStrictEqual({
        text: 'More photos',
        internalPath: 'photo-gallery',
      });

      expect(component.schedulePageLink).toStrictEqual({
        text: 'All scheduled events',
        internalPath: 'schedule',
      });
    });

    it('should have correct exportToCsvButton configuration', () => {
      expect(component.exportToCsvButton).toEqual({
        id: 'export-to-csv',
        tooltip: 'Export to CSV',
        icon: 'download',
        action: expect.any(Function),
      });
    });

    it('should call onExportToCsv when exportToCsvButton action is called', () => {
      component.exportToCsvButton.action();

      expect(onExportToCsvSpy).toHaveBeenCalledTimes(1);
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
          query(fixture.debugElement, '.schedule-section lcc-events-table'),
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
        ).toHaveLength(4);

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
