import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import { MOCK_ARTICLES } from '@app/mocks/articles.mock';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { Article, DataPaginationOptions } from '@app/models';
import { DialogService } from '@app/services';
import { query, queryAll, queryTextContent } from '@app/utils';

import { ArticleGridComponent } from './article-grid.component';

describe('ArticleGridComponent', () => {
  let fixture: ComponentFixture<ArticleGridComponent>;
  let component: ArticleGridComponent;

  let dialogService: DialogService;

  let dialogOpenSpy: jest.SpyInstance;
  let requestDeleteArticleSpy: jest.SpyInstance;
  let requestUpdateArticleBookmarkSpy: jest.SpyInstance;

  const mockOptions: DataPaginationOptions<Article> = {
    page: 1,
    pageSize: 10,
    sortBy: 'modificationInfo',
    sortOrder: 'desc',
    filters: {},
    search: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminControlsDirective, ArticleGridComponent, ImagePreloadDirective],
      providers: [
        provideRouter([]),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ArticleGridComponent);
        component = fixture.componentInstance;
        dialogService = TestBed.inject(DialogService);

        component.articles = MOCK_ARTICLES;
        component.articleImages = MOCK_IMAGES;
        component.isAdmin = true;
        component.options = mockOptions;

        dialogOpenSpy = jest.spyOn(dialogService, 'open');
        requestDeleteArticleSpy = jest.spyOn(component.requestDeleteArticle, 'emit');
        requestUpdateArticleBookmarkSpy = jest.spyOn(
          component.requestUpdateArticleBookmark,
          'emit',
        );

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when articleImages changes', () => {
    it('should update the bannerImagesMap', () => {
      component.ngOnChanges({
        articleImages: {
          currentValue: MOCK_IMAGES,
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.getBannerImage(MOCK_IMAGES[0].id)).toEqual(MOCK_IMAGES[0]);
    });
  });

  describe('cardCount getter', () => {
    it('should return correct article card count', () => {
      component.articles = MOCK_ARTICLES.slice(0, 3);
      fixture.detectChanges();

      expect(component.cardCount).toBe(3);
    });
  });

  describe('getBannerImage', () => {
    it('should return the image from bannerImagesMap when available', () => {
      const mockImage = MOCK_IMAGES[0];
      component.ngOnChanges({
        articleImages: {
          currentValue: [mockImage],
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      const result = component.getBannerImage(mockImage.id);
      expect(result).toEqual(mockImage);
    });

    it('should return a placeholder object when image is not in map', () => {
      const unknownId = 'unknown-id';
      const result = component.getBannerImage(unknownId);

      expect(result).toEqual({ id: unknownId, caption: 'Loading...' });
    });
  });

  describe('getAdminControlsConfig', () => {
    it('should return correct configuration for bookmarked article', () => {
      const article = MOCK_ARTICLES[0];
      const config = component.getAdminControlsConfig(article);

      expect(config.bookmarked).toBe(true);
      expect(config.buttonSize).toBe(34);
      expect(config.editPath).toEqual(['article', 'edit', article.id]);
      expect(config.itemName).toBe(article.title);
      expect(config.bookmarkCb).toBeDefined();
      expect(config.deleteCb).toBeDefined();
    });

    it('should return correct configuration for non-bookmarked article', () => {
      const article = MOCK_ARTICLES[2];
      const config = component.getAdminControlsConfig(article);

      expect(config.bookmarked).toBe(false);
    });
  });

  describe('onDeleteArticle', () => {
    const mockArticle = MOCK_ARTICLES[0];

    it('should open confirmation dialog with correct parameters', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');

      await component.onDeleteArticle(mockArticle);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${mockArticle.title}?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
        isModal: true,
      });
    });

    it('should emit requestDeleteArticle when user confirms', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      await component.onDeleteArticle(mockArticle);

      expect(requestDeleteArticleSpy).toHaveBeenCalledWith(mockArticle);
    });

    it('should not emit requestDeleteArticle when user cancels', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');
      await component.onDeleteArticle(mockArticle);

      expect(requestDeleteArticleSpy).not.toHaveBeenCalled();
    });
  });

  describe('onBookmarkArticle', () => {
    describe('for a bookmarked article', () => {
      const bookmarkedArticle = MOCK_ARTICLES[0];

      it('should open dialog with remove bookmark message', async () => {
        dialogOpenSpy.mockResolvedValue('cancel');
        await component.onBookmarkArticle(bookmarkedArticle);

        expect(dialogOpenSpy).toHaveBeenCalledWith({
          componentType: BasicDialogComponent,
          inputs: {
            dialog: {
              title: 'Confirm',
              body: `Remove bookmark from article ${bookmarkedArticle.title}?`,
              confirmButtonText: 'Remove',
              confirmButtonType: 'primary',
            },
          },
          isModal: true,
        });
      });

      it('should emit requestUpdateArticleBookmark with bookmark false when confirmed', async () => {
        dialogOpenSpy.mockResolvedValue('confirm');
        await component.onBookmarkArticle(bookmarkedArticle);

        expect(requestUpdateArticleBookmarkSpy).toHaveBeenCalledWith({
          articleId: bookmarkedArticle.id,
          bookmark: false,
        });
      });
    });

    describe('for a non-bookmarked article', () => {
      const nonBookmarkedArticle = MOCK_ARTICLES[2];

      it('should open dialog with add bookmark message', async () => {
        dialogOpenSpy.mockResolvedValue('cancel');

        await component.onBookmarkArticle(nonBookmarkedArticle);

        expect(dialogOpenSpy).toHaveBeenCalledWith({
          componentType: BasicDialogComponent,
          inputs: {
            dialog: {
              title: 'Confirm',
              body: `Bookmark ${nonBookmarkedArticle.title}? This will make the article show up first in the list of articles.`,
              confirmButtonText: 'Bookmark',
              confirmButtonType: 'primary',
            },
          },
          isModal: true,
        });
      });

      it('should emit requestUpdateArticleBookmark with bookmark true when confirmed', async () => {
        dialogOpenSpy.mockResolvedValue('confirm');
        await component.onBookmarkArticle(nonBookmarkedArticle);

        expect(requestUpdateArticleBookmarkSpy).toHaveBeenCalledWith({
          articleId: nonBookmarkedArticle.id,
          bookmark: true,
        });
      });
    });
  });

  describe('template rendering', () => {
    it('should render correct number of article cards', () => {
      component.articles = MOCK_ARTICLES.slice(0, 3);
      fixture.detectChanges();

      expect(queryAll(fixture.debugElement, '.article').length).toBe(3);
    });

    it('should display article titles', () => {
      component.articles = [MOCK_ARTICLES[0]];
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.article-title')).toBe(
        MOCK_ARTICLES[0].title,
      );
    });

    it('should display formatted dates', () => {
      component.articles = [MOCK_ARTICLES[0]];
      fixture.detectChanges();

      expect(queryTextContent(fixture.debugElement, '.article-creation-date')).toContain(
        'Jan 1, 2025',
      );
    });

    it('should show admin controls when isAdmin is true', () => {
      component.isAdmin = true;
      component.articles = [MOCK_ARTICLES[0]];
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.article')).toBeTruthy();

      const adminConfig = component.getAdminControlsConfig(MOCK_ARTICLES[0]);
      expect(adminConfig.editPath).toBeTruthy();
    });

    it('should not show admin controls when isAdmin is false', () => {
      component.isAdmin = false;
      component.articles = [MOCK_ARTICLES[0]];
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.article')).toBeTruthy();
      expect(component.isAdmin).toBe(false);
    });

    it('should show bookmark icon for bookmarked articles', () => {
      component.articles = [MOCK_ARTICLES[0]];
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.bookmark-icon')).toBeTruthy();
    });

    it('should not show bookmark icon for non-bookmarked articles', () => {
      component.articles = [MOCK_ARTICLES[2]];
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.bookmark-icon')).toBeFalsy();
    });

    it('should apply correct router link to article cards', () => {
      component.articles = [MOCK_ARTICLES[0]];
      fixture.detectChanges();

      expect(
        query(fixture.debugElement, '.article').nativeElement.getAttribute('href'),
      ).toBe('/article/view/' + MOCK_ARTICLES[0].id);
    });

    it('should display banner images with correct source', () => {
      component.articles = [MOCK_ARTICLES[0]];
      component.articleImages = [MOCK_IMAGES[0]];
      component.ngOnChanges({
        articleImages: {
          currentValue: [MOCK_IMAGES[0]],
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      fixture.detectChanges();

      const bannerImg = query(fixture.debugElement, '.image-container img');
      expect(bannerImg.attributes['src']).toBe(MOCK_IMAGES[0].thumbnailUrl);
    });

    it('should strip markdown from article body preview', () => {
      component.articles = [MOCK_ARTICLES[2]];
      fixture.detectChanges();

      const bodyPreview = queryTextContent(fixture.debugElement, '.article-preview');
      expect(bodyPreview).toContain('An article header');
      expect(bodyPreview).toContain('And not much text underneath it.');
      expect(bodyPreview).not.toContain('#');
    });

    it('should apply search highlighting when search term is present', () => {
      component.options = { ...mockOptions, search: 'blitz' };
      component.articles = [MOCK_ARTICLES[0]];
      fixture.detectChanges();

      const highlightedTitle = queryTextContent(
        fixture.debugElement,
        '.article-title mark',
      );
      expect(highlightedTitle).toContain('Blitz');
    });
  });
});
