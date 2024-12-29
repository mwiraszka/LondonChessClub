import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ImagesService } from '@app/services';
import { parseHttpErrorResponse } from '@app/utils';

import * as AppActions from './app.actions';

@Injectable()
export class AppEffects {
  // TODO: Streamline toast flow and remove from store by implementing
  // a generalized Notification Service instead

  requestImageDeletion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.deleteImageRequested),
      switchMap(({ imageId }) => {
        return this.imagesService.deleteImage(imageId).pipe(
          map(imageId => AppActions.deleteImageSucceeded({ imageId })),
          catchError((errorResponse: HttpErrorResponse) => {
            const error = parseHttpErrorResponse(errorResponse);
            return of(AppActions.deleteImageFailed({ error }));
          }),
        );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly imagesService: ImagesService,
  ) {}
}
