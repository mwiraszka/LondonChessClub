import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AppActions } from '@app/store/app';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthActions } from '@app/store/auth';
import { EventsActions } from '@app/store/events';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { MembersActions } from '@app/store/members';
import { isCollectionId, isDefined, isEntity } from '@app/utils';

import { NavActions, NavSelectors } from '.';

@Injectable()
export class NavEffects {
  appendPathToHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      map(path => NavActions.appendPathToHistory({ path })),
    ),
  );

  redirectOnAccessDenied$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.pageAccessDenied),
        concatLatestFrom(() => this.store.select(NavSelectors.selectCurrentPath)),
        tap(([, currentPath]) => this.router.navigate([currentPath ?? '/'])),
      ),
    { dispatch: false },
  );

  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.navigationRequested),
        tap(({ path }) => {
          if (path.includes('www.') || path.includes('http')) {
            window.open(path, '_blank');
          } else {
            this.router.navigate([path]);
          }
        }),
      ),
    { dispatch: false },
  );

  navigateHome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSucceeded, AuthActions.passwordChangeSucceeded),
      map(() => NavActions.navigationRequested({ path: '' })),
    ),
  );

  navigateToMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        MembersActions.cancelSelected,
        MembersActions.addMemberSucceeded,
        MembersActions.updateMemberSucceeded,
        MembersActions.fetchMemberFailed,
      ),
      map(() => NavActions.navigationRequested({ path: 'members' })),
    ),
  );

  navigateToSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EventsActions.cancelSelected,
        EventsActions.addEventSucceeded,
        EventsActions.updateEventSucceeded,
        EventsActions.fetchEventFailed,
      ),
      map(() => NavActions.navigationRequested({ path: 'schedule' })),
    ),
  );

  navigateToNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.cancelSelected,
        ArticlesActions.fetchArticleFailed,
        ArticlesActions.publishArticleSucceeded,
        ArticlesActions.updateArticleSucceeded,
      ),
      map(() => NavActions.navigationRequested({ path: 'news' })),
    ),
  );

  navigateToNewsAfterArticleDeletion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleSucceeded),
      concatLatestFrom(() => this.store.select(NavSelectors.selectCurrentPath)),
      filter(
        ([{ articleId }, currentPath]) => currentPath === `/article/view/${articleId}`,
      ),
      map(() => NavActions.navigationRequested({ path: 'news' })),
    ),
  );

  navigateToPhotoGallery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ImagesActions.cancelSelected,
        ImagesActions.addImageSucceeded,
        ImagesActions.addImagesSucceeded,
        ImagesActions.updateImageSucceeded,
        ImagesActions.updateAlbumSucceeded,
      ),
      map(() => NavActions.navigationRequested({ path: 'photo-gallery' })),
    ),
  );

  navigateToLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSucceeded),
      map(() => NavActions.navigationRequested({ path: 'login' })),
    ),
  );

  handleEntityRouteNavigationRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      concatLatestFrom(() => this.store.select(NavSelectors.selectCurrentPath)),
      filter(
        ([requestedPath, currentPath]) =>
          requestedPath !== currentPath && isEntity(requestedPath.split('/').slice(1)[0]),
      ),
      map(([requestedPath]) => {
        const [entity, controlMode, idWithFragment] = requestedPath.split('/').slice(1);
        const id = idWithFragment ? idWithFragment.split('#')[0] : null;

        switch (entity) {
          case 'album':
            if (controlMode === 'add' && !isDefined(id)) {
              return ImagesActions.createAnAlbumSelected();
            } else if (['edit', 'view'].includes(controlMode) && isCollectionId(id)) {
              return ImagesActions.fetchAlbumThumbnailsRequested({ album: id });
            }
            return NavActions.navigationRequested({ path: 'photo-gallery' });

          case 'article':
            if (controlMode === 'add' && !isDefined(id)) {
              return ArticlesActions.createAnArticleSelected();
            } else if (['edit', 'view'].includes(controlMode) && isCollectionId(id)) {
              return ArticlesActions.fetchArticleRequested({ articleId: id });
            }
            return NavActions.navigationRequested({ path: 'news' });

          case 'event':
            if (controlMode === 'add' && !isDefined(id)) {
              return EventsActions.addAnEventSelected();
            } else if (controlMode === 'edit' && isCollectionId(id)) {
              return EventsActions.fetchEventRequested({ eventId: id });
            }
            return NavActions.navigationRequested({ path: 'schedule' });

          case 'image':
            if (controlMode === 'add' && !isDefined(id)) {
              return ImagesActions.addAnImageSelected();
            } else if (controlMode === 'edit' && isCollectionId(id)) {
              return ImagesActions.fetchMainImageRequested({ imageId: id });
            }
            return NavActions.navigationRequested({ path: 'photo-gallery' });

          case 'member':
            if (controlMode === 'add' && !isDefined(id)) {
              return MembersActions.addAMemberSelected();
            } else if (controlMode === 'edit' && isCollectionId(id)) {
              return MembersActions.fetchMemberRequested({ memberId: id });
            }
            return NavActions.navigationRequested({ path: 'members' });

          default:
            return AppActions.unexpectedErrorOccurred({
              error: {
                name: 'LCCError',
                message: `Unknown entity provided for entity route navigation: ${entity}`,
              },
            });
        }
      }),
    ),
  );

  restoreFormDataOnNavigationAwayFromEntityRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      concatLatestFrom(() => this.store.select(NavSelectors.selectCurrentPath)),
      filter(([requestedPath, currentPath]) => {
        const currentPathPage = currentPath ? currentPath.split('/').slice(1)[0] : null;
        const requestedPathPage = requestedPath.split('/').slice(1)[0];
        return isEntity(currentPathPage) && requestedPathPage !== currentPathPage;
      }),
      map(([, currentPath]) => {
        const [entity, , idWithFragment] = currentPath!.split('/').slice(1);
        const id = idWithFragment ? idWithFragment.split('#')[0] : null;

        switch (entity) {
          case 'album':
            // Album entity uses unique album name in place of a UUID
            return ImagesActions.albumFormDataRestored({ album: id });
          case 'article':
            return ArticlesActions.formDataRestored({ articleId: id });
          case 'event':
            return EventsActions.formDataRestored({ eventId: id });
          case 'image':
            return ImagesActions.imageFormDataRestored({ imageId: id });
          case 'member':
            return MembersActions.formDataRestored({ memberId: id });
          default:
            return AppActions.unexpectedErrorOccurred({
              error: {
                name: 'LCCError',
                message: `Unknown entity provided for form data restoration: ${entity}`,
              },
            });
        }
      }),
    ),
  );

  fetchImageForArticleViewRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/article/view/')),
      map(currentPath => currentPath.split('/article/view/')[1]),
      filter(isDefined),
      switchMap(articleId =>
        this.store.select(ArticlesSelectors.selectArticleById(articleId)).pipe(
          filter(isDefined),
          map(article => article.bannerImageId),
          concatLatestFrom(id => this.store.select(ImagesSelectors.selectImageById(id))),
          filter(([, image]) => !image?.mainUrl),
          map(([imageId]) => ImagesActions.fetchMainImageRequested({ imageId })),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly store: Store,
  ) {}
}
