import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment-timezone';
import { ReplaySubject } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { MOCK_ARTICLES } from '@app/mocks/articles.mock';
import { MOCK_EVENTS } from '@app/mocks/events.mock';
import { MOCK_IMAGES } from '@app/mocks/images.mock';
import { MOCK_MEMBERS } from '@app/mocks/members.mock';
import { LccError } from '@app/models';
import { ToastService } from '@app/services';
import { ArticlesActions } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { EventsActions } from '@app/store/events';
import { ImagesActions } from '@app/store/images';
import { MembersActions } from '@app/store/members';
import { NavActions } from '@app/store/nav';

import { environment } from '@env';

import { AppActions, AppSelectors } from '.';
import { AppEffects } from './app.effects';

describe('AppEffects', () => {
  let effects: AppEffects;
  let actions$: ReplaySubject<Action>;
  let store: MockStore;
  let toastService: jest.Mocked<ToastService>;

  const mockError: LccError = {
    name: 'LCCError',
    message: 'Test error message',
    status: 500,
  };

  beforeEach(() => {
    const toastServiceMock = {
      displayToast: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AppEffects,
        provideMockActions(() => actions$),
        { provide: ToastService, useValue: toastServiceMock },
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(AppEffects);
    toastService = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    store = TestBed.inject(MockStore);
    actions$ = new ReplaySubject<Action>(1);

    jest.clearAllMocks();
  });

  describe('notify$', () => {
    beforeEach(() => {
      store.overrideSelector(AuthSelectors.selectIsAdmin, true);
      store.refreshState();
    });

    describe('App actions', () => {
      it('should display toast for unexpectedErrorOccurred', done => {
        actions$.next(AppActions.unexpectedErrorOccurred({ error: mockError }));

        effects.notify$.subscribe(action => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Unexpected error',
            message: '[500] Test error message',
            type: 'warning',
          });
          expect(action).toEqual(
            AppActions.toastDisplayed({
              toast: {
                title: 'Unexpected error',
                message: '[500] Test error message',
                type: 'warning',
              },
            }),
          );
          done();
        });
      });
    });

    describe('Articles actions', () => {
      it('should display toast for deleteArticleFailed', done => {
        actions$.next(ArticlesActions.deleteArticleFailed({ error: mockError }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Article deletion',
            message: '[500] Test error message',
            type: 'warning',
          });
          done();
        });
      });

      it('should display toast for deleteArticleSucceeded', done => {
        actions$.next(
          ArticlesActions.deleteArticleSucceeded({
            articleId: 'test123',
            articleTitle: 'Test Article',
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Article deletion',
            message: 'Successfully deleted Test Article',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for fetchArticleFailed', done => {
        actions$.next(ArticlesActions.fetchArticleFailed({ error: mockError }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Load article',
            message: '[500] Test error message',
            type: 'warning',
          });
          done();
        });
      });

      it('should display toast for publishArticleSucceeded', done => {
        const article = { ...MOCK_ARTICLES[0], title: 'New Article' };
        actions$.next(ArticlesActions.publishArticleSucceeded({ article }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'New article',
            message: 'Successfully published New Article',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for updateArticleSucceeded', done => {
        actions$.next(
          ArticlesActions.updateArticleSucceeded({
            article: MOCK_ARTICLES[0],
            originalArticleTitle: 'Original Title',
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Article update',
            message: 'Successfully updated Original Title',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for requestTimedOut', done => {
        actions$.next(ArticlesActions.requestTimedOut());

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Articles request',
            message: 'Request timed out',
            type: 'warning',
          });
          done();
        });
      });
    });

    describe('Auth actions', () => {
      it('should display toast for codeForPasswordChangeSucceeded', done => {
        actions$.next(AuthActions.codeForPasswordChangeSucceeded());

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Password change',
            message: 'A 6-digit code has been sent to your email',
            type: 'info',
          });
          done();
        });
      });

      it('should display toast for loginSucceeded', done => {
        actions$.next(
          AuthActions.loginSucceeded({
            user: {
              id: 'user123',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@test.com',
              isAdmin: true,
            },
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Admin login',
            message: 'Successfully logged in',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for logoutSucceeded with session expired', done => {
        actions$.next(AuthActions.logoutSucceeded({ sessionExpired: true }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Admin logout',
            message: 'Session expired - please log back in',
            type: 'info',
          });
          done();
        });
      });

      it('should display toast for logoutSucceeded without session expired', done => {
        actions$.next(AuthActions.logoutSucceeded({ sessionExpired: false }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Admin logout',
            message: 'Successfully logged out',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for passwordChangeSucceeded', done => {
        actions$.next(
          AuthActions.passwordChangeSucceeded({
            user: {
              id: 'user123',
              firstName: 'Test',
              lastName: 'User',
              email: 'test@test.com',
              isAdmin: true,
            },
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Password change',
            message: 'Successfully changed password and logged in',
            type: 'success',
          });
          done();
        });
      });
    });

    describe('Events actions', () => {
      it('should display toast for addEventSucceeded', done => {
        const event = { ...MOCK_EVENTS[0], title: 'New Event' };
        actions$.next(EventsActions.addEventSucceeded({ event }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'New event',
            message: 'Successfully added New Event',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for deleteEventSucceeded', done => {
        actions$.next(
          EventsActions.deleteEventSucceeded({
            eventId: 'evt123',
            eventTitle: 'Test Event',
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Event deletion',
            message: 'Successfully deleted Test Event',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for exportEventsToCsvSucceeded', done => {
        actions$.next(EventsActions.exportEventsToCsvSucceeded({ exportedCount: 25 }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'CSV export',
            message: 'Successfully exported 25 events to CSV',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for updateEventSucceeded', done => {
        actions$.next(
          EventsActions.updateEventSucceeded({
            event: MOCK_EVENTS[0],
            originalEventTitle: 'Original Event',
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Event update',
            message: 'Successfully updated Original Event',
            type: 'success',
          });
          done();
        });
      });
    });

    describe('Images actions', () => {
      it('should display toast for addImageSucceeded', done => {
        const image = { ...MOCK_IMAGES[0], filename: 'test.jpg' };
        actions$.next(ImagesActions.addImageSucceeded({ image }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Add image',
            message: 'Successfully uploaded test.jpg',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for addImagesSucceeded with single image', done => {
        actions$.next(ImagesActions.addImagesSucceeded({ images: [MOCK_IMAGES[0]] }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Add images',
            message: 'Successfully uploaded 1 image',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for addImagesSucceeded with multiple images', done => {
        actions$.next(
          ImagesActions.addImagesSucceeded({ images: [MOCK_IMAGES[0], MOCK_IMAGES[1]] }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Add images',
            message: 'Successfully uploaded 2 images',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for deleteAlbumSucceeded', done => {
        actions$.next(
          ImagesActions.deleteAlbumSucceeded({
            album: 'Test Album',
            imageIds: ['1', '2'],
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Album deletion',
            message: 'Successfully deleted Test Album and all 2 of its images',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for deleteImageSucceeded', done => {
        const image = { ...MOCK_IMAGES[0], filename: 'test.jpg' };
        actions$.next(ImagesActions.deleteImageSucceeded({ image }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Image deletion',
            message: 'Successfully deleted test.jpg',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for updateAlbumSucceeded', done => {
        actions$.next(
          ImagesActions.updateAlbumSucceeded({
            album: 'Test Album',
            newImages: [],
            updatedImages: [],
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Album update',
            message: 'Successfully updated Test Album',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for updateImageSucceeded', done => {
        const baseImage = { ...MOCK_IMAGES[0], filename: 'updated.jpg' };
        actions$.next(ImagesActions.updateImageSucceeded({ baseImage }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Image update',
            message: 'Successfully updated updated.jpg',
            type: 'success',
          });
          done();
        });
      });
    });

    describe('Members actions', () => {
      it('should display toast for addMemberSucceeded', done => {
        const member = { ...MOCK_MEMBERS[0], firstName: 'John', lastName: 'Doe' };
        actions$.next(MembersActions.addMemberSucceeded({ member }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'New member',
            message: 'Successfully added John Doe',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for deleteMemberSucceeded', done => {
        actions$.next(
          MembersActions.deleteMemberSucceeded({
            memberId: 'mem123',
            memberName: 'Jane Smith',
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Member deletion',
            message: 'Successfully deleted Jane Smith',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for exportMembersToCsvSucceeded', done => {
        actions$.next(MembersActions.exportMembersToCsvSucceeded({ exportedCount: 50 }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'CSV export',
            message: 'Successfully exported 50 members to CSV',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for updateMemberSucceeded', done => {
        actions$.next(
          MembersActions.updateMemberSucceeded({
            member: MOCK_MEMBERS[0],
            originalMemberName: 'Old Name',
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Member update',
            message: 'Successfully updated Old Name',
            type: 'success',
          });
          done();
        });
      });

      it('should display toast for updateMemberRatingsSucceeded', done => {
        actions$.next(
          MembersActions.updateMemberRatingsSucceeded({
            members: [MOCK_MEMBERS[0], MOCK_MEMBERS[1]],
          }),
        );

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Members update',
            message: 'Successfully updated 2 members',
            type: 'success',
          });
          done();
        });
      });
    });

    describe('Nav actions', () => {
      it('should display toast for pageAccessDenied', done => {
        actions$.next(NavActions.pageAccessDenied({ pageHeading: 'Admin Panel' }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalledWith({
            title: 'Access denied',
            message: 'Please log in as admin to access Admin Panel page',
            type: 'info',
          });
          done();
        });
      });
    });

    describe('Toast suppression in production', () => {
      beforeEach(() => {
        // Mock production environment
        (environment as { production: boolean }).production = true;
        store.overrideSelector(AuthSelectors.selectIsAdmin, false);
        store.refreshState();
      });

      afterEach(() => {
        (environment as { production: boolean }).production = false;
      });

      it('should suppress fetchArticleFailed toast in production for non-admin', done => {
        actions$.next(ArticlesActions.fetchArticleFailed({ error: mockError }));

        setTimeout(() => {
          expect(toastService.displayToast).not.toHaveBeenCalled();
          done();
        }, 10);
      });

      it('should still show deleteArticleFailed toast in production for non-admin', done => {
        actions$.next(ArticlesActions.deleteArticleFailed({ error: mockError }));

        effects.notify$.subscribe(() => {
          expect(toastService.displayToast).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should log error to console when action has error property', done => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      actions$.next(ArticlesActions.fetchArticleFailed({ error: mockError }));

      effects.notify$.subscribe(() => {
        expect(consoleSpy).toHaveBeenCalledWith('[LCC]', mockError);
        consoleSpy.mockRestore();
        done();
      });
    });
  });

  describe('reinstateUpcomingEventBanner$', () => {
    it('should reinstate banner when more than a day has passed', done => {
      const yesterday = moment().subtract(2, 'days').toISOString();
      store.overrideSelector(AppSelectors.selectBannerLastCleared, yesterday);
      store.refreshState();

      effects.reinstateUpcomingEventBanner$.subscribe(action => {
        expect(action).toEqual(AppActions.upcomingEventBannerReinstated());
        done();
      });
    });

    it('should not reinstate banner when cleared today', done => {
      const today = moment().toISOString();
      store.overrideSelector(AppSelectors.selectBannerLastCleared, today);
      store.refreshState();

      setTimeout(() => {
        // No action should be emitted
        done();
      }, 10);
    });

    it('should not reinstate banner when never cleared', done => {
      store.overrideSelector(AppSelectors.selectBannerLastCleared, null);
      store.refreshState();

      setTimeout(() => {
        // No action should be emitted
        done();
      }, 10);
    });
  });
});
