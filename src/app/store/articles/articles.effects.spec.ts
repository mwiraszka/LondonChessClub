import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment-timezone';
import { ReplaySubject, of, throwError } from 'rxjs';

import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { INITIAL_ARTICLE_FORM_DATA } from '@app/constants';
import { MOCK_ARTICLES } from '@app/mocks/articles.mock';
import { ApiResponse, Article, LccError, PaginatedItems, User } from '@app/models';
import { ArticlesApiService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';

import { ArticlesActions, ArticlesSelectors } from '.';
import { ArticlesEffects } from './articles.effects';

const mockParseError = jest.fn();
const mockIsExpired = jest.fn();

jest.mock('@app/utils', () => ({
  isDefined: <T>(value: T | null | undefined): value is T => value != null,
  isExpired: (date: unknown) => mockIsExpired(date),
  parseError: (error: unknown) => mockParseError(error),
}));

describe('ArticlesEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: ArticlesEffects;
  let articlesApiService: jest.Mocked<ArticlesApiService>;
  let store: MockStore;

  const mockUser: User = {
    id: 'user123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    isAdmin: true,
  };

  const mockError: LccError = {
    name: 'LCCError',
    message: 'Test error',
  };

  const mockApiResponse: ApiResponse<PaginatedItems<Article>> = {
    data: {
      items: [MOCK_ARTICLES[0], MOCK_ARTICLES[1]],
      filteredCount: 2,
      totalCount: 5,
    },
  };

  beforeEach(() => {
    const articlesApiServiceMock = {
      getFilteredArticles: jest.fn(),
      getArticle: jest.fn(),
      addArticle: jest.fn(),
      updateArticle: jest.fn(),
      deleteArticle: jest.fn(),
    };

    const mockArticlesState = {
      ids: MOCK_ARTICLES.map(a => a.id),
      entities: MOCK_ARTICLES.reduce(
        (acc, article) => ({
          ...acc,
          [article.id]: { article, formData: INITIAL_ARTICLE_FORM_DATA },
        }),
        {},
      ),
      callState: { status: 'idle' as const, loadStart: null, error: null },
      newArticleFormData: INITIAL_ARTICLE_FORM_DATA,
      lastHomePageFetch: null,
      lastFilteredFetch: null,
      homePageArticles: [],
      filteredArticles: [],
      options: {
        page: 1,
        pageSize: 10,
        sortBy: 'bookmarkDate',
        sortOrder: 'desc',
        filters: null,
        search: '',
      },
      filteredCount: null,
      totalCount: 0,
    };

    TestBed.configureTestingModule({
      providers: [
        ArticlesEffects,
        provideMockActions(() => actions$),
        { provide: ArticlesApiService, useValue: articlesApiServiceMock },
        provideMockStore({
          initialState: {
            articlesState: mockArticlesState,
          },
        }),
      ],
    });

    effects = TestBed.inject(ArticlesEffects);
    articlesApiService = TestBed.inject(
      ArticlesApiService,
    ) as jest.Mocked<ArticlesApiService>;
    store = TestBed.inject(MockStore);
    actions$ = new ReplaySubject<Action>(1);

    jest.clearAllMocks();
    mockParseError.mockImplementation(error => error);
  });

  describe('fetchHomePageArticles$', () => {
    it('should fetch home page articles with correct options', done => {
      articlesApiService.getFilteredArticles.mockReturnValue(of(mockApiResponse));

      actions$.next(ArticlesActions.fetchHomePageArticlesRequested());

      effects.fetchHomePageArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchHomePageArticlesSucceeded({
            articles: mockApiResponse.data.items,
            totalCount: mockApiResponse.data.totalCount,
          }),
        );
        expect(articlesApiService.getFilteredArticles).toHaveBeenCalledWith({
          page: 1,
          pageSize: 6,
          sortBy: 'bookmarkDate',
          sortOrder: 'desc',
          filters: null,
          search: '',
        });
        done();
      });
    });

    it('should fetch home page articles in background', done => {
      articlesApiService.getFilteredArticles.mockReturnValue(of(mockApiResponse));

      actions$.next(ArticlesActions.fetchHomePageArticlesInBackgroundRequested());

      effects.fetchHomePageArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchHomePageArticlesSucceeded({
            articles: mockApiResponse.data.items,
            totalCount: mockApiResponse.data.totalCount,
          }),
        );
        done();
      });
    });

    it('should handle fetch home page articles failure', done => {
      articlesApiService.getFilteredArticles.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ArticlesActions.fetchHomePageArticlesRequested());

      effects.fetchHomePageArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchHomePageArticlesFailed({ error: mockError }),
        );
        done();
      });
    });
  });

  describe('fetchFilteredArticles$', () => {
    const mockOptions = {
      page: 2,
      pageSize: 10,
      sortBy: 'title' as const,
      sortOrder: 'asc' as const,
      filters: null,
      search: 'tournament',
    };

    beforeEach(() => {
      store.overrideSelector(ArticlesSelectors.selectOptions, mockOptions);
      store.refreshState();
    });

    it('should fetch filtered articles with options from store', done => {
      articlesApiService.getFilteredArticles.mockReturnValue(of(mockApiResponse));

      actions$.next(ArticlesActions.fetchFilteredArticlesRequested());

      effects.fetchFilteredArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchFilteredArticlesSucceeded({
            articles: mockApiResponse.data.items,
            filteredCount: mockApiResponse.data.filteredCount,
            totalCount: mockApiResponse.data.totalCount,
          }),
        );
        expect(articlesApiService.getFilteredArticles).toHaveBeenCalledWith(mockOptions);
        done();
      });
    });

    it('should fetch filtered articles in background', done => {
      articlesApiService.getFilteredArticles.mockReturnValue(of(mockApiResponse));

      actions$.next(ArticlesActions.fetchFilteredArticlesInBackgroundRequested());

      effects.fetchFilteredArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchFilteredArticlesSucceeded({
            articles: mockApiResponse.data.items,
            filteredCount: mockApiResponse.data.filteredCount,
            totalCount: mockApiResponse.data.totalCount,
          }),
        );
        done();
      });
    });

    it('should handle fetch filtered articles failure', done => {
      articlesApiService.getFilteredArticles.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ArticlesActions.fetchFilteredArticlesRequested());

      effects.fetchFilteredArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchFilteredArticlesFailed({ error: mockError }),
        );
        done();
      });
    });
  });

  describe('refetchHomePageArticles$', () => {
    it('should trigger refetch after publishArticleSucceeded', done => {
      actions$.next(
        ArticlesActions.publishArticleSucceeded({ article: MOCK_ARTICLES[0] }),
      );

      effects.refetchHomePageArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchHomePageArticlesInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch after updateArticleSucceeded', done => {
      actions$.next(
        ArticlesActions.updateArticleSucceeded({
          article: MOCK_ARTICLES[0],
          originalArticleTitle: 'Old Title',
        }),
      );

      effects.refetchHomePageArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchHomePageArticlesInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch after deleteArticleSucceeded', done => {
      actions$.next(
        ArticlesActions.deleteArticleSucceeded({
          articleId: MOCK_ARTICLES[0].id,
          articleTitle: MOCK_ARTICLES[0].title,
        }),
      );

      effects.refetchHomePageArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchHomePageArticlesInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch when last fetch is expired', fakeAsync(() => {
      const expiredTimestamp = moment().subtract(20, 'minutes').toISOString();
      store.overrideSelector(ArticlesSelectors.selectLastHomePageFetch, expiredTimestamp);
      store.refreshState();
      mockIsExpired.mockReturnValue(true);

      const results: Action[] = [];
      effects.refetchHomePageArticles$.subscribe(action => {
        results.push(action);
      });

      tick(3000);
      tick(10 * 60 * 1000);

      expect(results[0]).toEqual(
        ArticlesActions.fetchHomePageArticlesInBackgroundRequested(),
      );
      expect(mockIsExpired).toHaveBeenCalledWith(expiredTimestamp);
    }));

    it('should not trigger refetch when last fetch is not expired', fakeAsync(() => {
      const recentTimestamp = moment().subtract(5, 'minutes').toISOString();
      store.overrideSelector(ArticlesSelectors.selectLastHomePageFetch, recentTimestamp);
      store.refreshState();
      mockIsExpired.mockReturnValue(false);

      const results: Action[] = [];
      effects.refetchHomePageArticles$.subscribe(action => {
        results.push(action);
      });

      tick(3000);
      tick(10 * 60 * 1000);

      expect(results).toHaveLength(0);
    }));
  });

  describe('refetchFilteredArticles$', () => {
    it('should trigger refetch after publishArticleSucceeded', done => {
      actions$.next(
        ArticlesActions.publishArticleSucceeded({ article: MOCK_ARTICLES[0] }),
      );

      effects.refetchFilteredArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchFilteredArticlesInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch after updateArticleSucceeded', done => {
      actions$.next(
        ArticlesActions.updateArticleSucceeded({
          article: MOCK_ARTICLES[0],
          originalArticleTitle: 'Old Title',
        }),
      );

      effects.refetchFilteredArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchFilteredArticlesInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch after deleteArticleSucceeded', done => {
      actions$.next(
        ArticlesActions.deleteArticleSucceeded({
          articleId: MOCK_ARTICLES[0].id,
          articleTitle: MOCK_ARTICLES[0].title,
        }),
      );

      effects.refetchFilteredArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchFilteredArticlesInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch after paginationOptionsChanged', done => {
      actions$.next(
        ArticlesActions.paginationOptionsChanged({
          options: {
            page: 1,
            pageSize: 10,
            sortBy: 'bookmarkDate',
            sortOrder: 'desc',
            filters: null,
            search: '',
          },
          fetch: true,
        }),
      );

      effects.refetchFilteredArticles$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchFilteredArticlesInBackgroundRequested(),
        );
        done();
      });
    });

    it('should trigger refetch when last fetch is expired', fakeAsync(() => {
      const expiredTimestamp = moment().subtract(20, 'minutes').toISOString();
      store.overrideSelector(ArticlesSelectors.selectLastFilteredFetch, expiredTimestamp);
      store.refreshState();
      mockIsExpired.mockReturnValue(true);

      const results: Action[] = [];
      effects.refetchFilteredArticles$.subscribe(action => {
        results.push(action);
      });

      tick(3000);
      tick(10 * 60 * 1000);

      expect(results[0]).toEqual(
        ArticlesActions.fetchFilteredArticlesInBackgroundRequested(),
      );
      expect(mockIsExpired).toHaveBeenCalledWith(expiredTimestamp);
    }));

    it('should not trigger refetch when last fetch is not expired', fakeAsync(() => {
      const recentTimestamp = moment().subtract(5, 'minutes').toISOString();
      store.overrideSelector(ArticlesSelectors.selectLastFilteredFetch, recentTimestamp);
      store.refreshState();
      mockIsExpired.mockReturnValue(false);

      const results: Action[] = [];
      effects.refetchFilteredArticles$.subscribe(action => {
        results.push(action);
      });

      tick(3000);
      tick(10 * 60 * 1000);

      expect(results).toHaveLength(0);
    }));
  });

  describe('fetchArticle$', () => {
    it('should fetch a single article successfully', done => {
      const mockResponse: ApiResponse<Article> = { data: MOCK_ARTICLES[0] };
      articlesApiService.getArticle.mockReturnValue(of(mockResponse));

      actions$.next(
        ArticlesActions.fetchArticleRequested({ articleId: MOCK_ARTICLES[0].id }),
      );

      effects.fetchArticle$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.fetchArticleSucceeded({ article: MOCK_ARTICLES[0] }),
        );
        expect(articlesApiService.getArticle).toHaveBeenCalledWith(MOCK_ARTICLES[0].id);
        done();
      });
    });

    it('should handle fetch article failure', done => {
      articlesApiService.getArticle.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ArticlesActions.fetchArticleRequested({ articleId: 'invalid-id' }));

      effects.fetchArticle$.subscribe(action => {
        expect(action).toEqual(ArticlesActions.fetchArticleFailed({ error: mockError }));
        done();
      });
    });
  });

  describe('publishArticle$', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
    });

    it('should publish article successfully', done => {
      const mockPublishResponse: ApiResponse<string> = { data: 'new-article-id' };

      articlesApiService.addArticle.mockReturnValue(of(mockPublishResponse));

      actions$.next(ArticlesActions.publishArticleRequested());

      effects.publishArticle$.subscribe(action => {
        expect(action.type).toBe(ArticlesActions.publishArticleSucceeded.type);
        const payload = (
          action as ReturnType<typeof ArticlesActions.publishArticleSucceeded>
        ).article;
        expect(payload.id).toBe('new-article-id');
        expect(payload.modificationInfo.createdBy).toBe('Test User');
        expect(payload.modificationInfo.lastEditedBy).toBe('Test User');
        expect(articlesApiService.addArticle).toHaveBeenCalled();
        done();
      });
    });

    it('should handle publish article failure', done => {
      articlesApiService.addArticle.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ArticlesActions.publishArticleRequested());

      effects.publishArticle$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.publishArticleFailed({ error: mockError }),
        );
        done();
      });
    });
  });

  describe('updateArticle$', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();
    });

    it('should update article successfully', done => {
      const articleId = MOCK_ARTICLES[0].id;
      const mockUpdateResponse: ApiResponse<string> = { data: articleId };

      articlesApiService.updateArticle.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ArticlesActions.updateArticleRequested({ articleId }));

      effects.updateArticle$.subscribe(action => {
        expect(action.type).toBe(ArticlesActions.updateArticleSucceeded.type);
        const payload = action as ReturnType<
          typeof ArticlesActions.updateArticleSucceeded
        >;
        expect(payload.article.id).toBe(articleId);
        expect(payload.article.modificationInfo.lastEditedBy).toBe('Test User');
        expect(payload.originalArticleTitle).toBe(MOCK_ARTICLES[0].title);
        expect(articlesApiService.updateArticle).toHaveBeenCalled();
        done();
      });
    });

    it('should handle update article failure', done => {
      const articleId = MOCK_ARTICLES[0].id;

      articlesApiService.updateArticle.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(ArticlesActions.updateArticleRequested({ articleId }));

      effects.updateArticle$.subscribe(action => {
        expect(action).toEqual(ArticlesActions.updateArticleFailed({ error: mockError }));
        done();
      });
    });

    it('should not dispatch success if response ID does not match', done => {
      const articleId = MOCK_ARTICLES[0].id;
      const mockUpdateResponse: ApiResponse<string> = { data: 'different-id' };

      articlesApiService.updateArticle.mockReturnValue(of(mockUpdateResponse));

      actions$.next(ArticlesActions.updateArticleRequested({ articleId }));

      const subscription = effects.updateArticle$.subscribe(() => {
        done.fail('Should not dispatch action when IDs do not match');
      });

      setTimeout(() => {
        subscription.unsubscribe();
        done();
      }, 100);
    });
  });

  describe('updateArticleBookmarkRequested$', () => {
    it('should update article bookmark to true successfully', done => {
      const articleId = MOCK_ARTICLES[0].id;
      const mockUpdateResponse: ApiResponse<string> = { data: articleId };

      articlesApiService.updateArticle.mockReturnValue(of(mockUpdateResponse));

      actions$.next(
        ArticlesActions.updateArticleBookmarkRequested({ articleId, bookmark: true }),
      );

      effects.updateArticleBookmarkRequested$.subscribe(action => {
        expect(action.type).toBe(ArticlesActions.updateArticleSucceeded.type);
        const payload = action as ReturnType<
          typeof ArticlesActions.updateArticleSucceeded
        >;
        expect(payload.article.bookmarkDate).not.toBeNull();
        expect(articlesApiService.updateArticle).toHaveBeenCalled();
        done();
      });
    });

    it('should update article bookmark to false successfully', done => {
      const articleId = MOCK_ARTICLES[0].id;
      const mockUpdateResponse: ApiResponse<string> = { data: articleId };

      articlesApiService.updateArticle.mockReturnValue(of(mockUpdateResponse));

      actions$.next(
        ArticlesActions.updateArticleBookmarkRequested({ articleId, bookmark: false }),
      );

      effects.updateArticleBookmarkRequested$.subscribe(action => {
        expect(action.type).toBe(ArticlesActions.updateArticleSucceeded.type);
        const payload = action as ReturnType<
          typeof ArticlesActions.updateArticleSucceeded
        >;
        expect(payload.article.bookmarkDate).toBeNull();
        done();
      });
    });

    it('should handle update article bookmark failure', done => {
      const articleId = MOCK_ARTICLES[0].id;

      articlesApiService.updateArticle.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(
        ArticlesActions.updateArticleBookmarkRequested({ articleId, bookmark: true }),
      );

      effects.updateArticleBookmarkRequested$.subscribe(action => {
        expect(action).toEqual(ArticlesActions.updateArticleFailed({ error: mockError }));
        done();
      });
    });
  });

  describe('deleteArticle$', () => {
    it('should delete article successfully', done => {
      const mockDeleteResponse: ApiResponse<string> = { data: MOCK_ARTICLES[0].id };
      articlesApiService.deleteArticle.mockReturnValue(of(mockDeleteResponse));

      actions$.next(
        ArticlesActions.deleteArticleRequested({ article: MOCK_ARTICLES[0] }),
      );

      effects.deleteArticle$.subscribe(action => {
        expect(action).toEqual(
          ArticlesActions.deleteArticleSucceeded({
            articleId: MOCK_ARTICLES[0].id,
            articleTitle: MOCK_ARTICLES[0].title,
          }),
        );
        expect(articlesApiService.deleteArticle).toHaveBeenCalledWith(
          MOCK_ARTICLES[0].id,
        );
        done();
      });
    });

    it('should handle delete article failure', done => {
      articlesApiService.deleteArticle.mockReturnValue(throwError(() => mockError));
      mockParseError.mockReturnValue(mockError);

      actions$.next(
        ArticlesActions.deleteArticleRequested({ article: MOCK_ARTICLES[0] }),
      );

      effects.deleteArticle$.subscribe(action => {
        expect(action).toEqual(ArticlesActions.deleteArticleFailed({ error: mockError }));
        done();
      });
    });

    it('should not dispatch success if response ID does not match', done => {
      const mockDeleteResponse: ApiResponse<string> = { data: 'different-id' };
      articlesApiService.deleteArticle.mockReturnValue(of(mockDeleteResponse));

      actions$.next(
        ArticlesActions.deleteArticleRequested({ article: MOCK_ARTICLES[0] }),
      );

      const subscription = effects.deleteArticle$.subscribe(() => {
        done.fail('Should not dispatch action when IDs do not match');
      });

      setTimeout(() => {
        subscription.unsubscribe();
        done();
      }, 100);
    });
  });
});
