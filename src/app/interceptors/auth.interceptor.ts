import { Store } from '@ngrx/store';
import { EMPTY, Observable, Subject, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LccError } from '@app/models';
import { AuthApiService } from '@app/services';
import { AuthActions } from '@app/store/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private sessionRefreshInProgress = false;
  private _tokenRefreshed$ = new Subject<boolean>();
  private tokenRefreshed$ = this._tokenRefreshed$.asObservable();

  constructor(
    private readonly authApiService: AuthApiService,
    private readonly store: Store,
  ) {}

  public intercept(
    req: HttpRequest<unknown>,
    handler: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const reqClone = req.clone({ withCredentials: true });

    return handler
      .handle(reqClone)
      .pipe(catchError(error => this.handleErrorResponse(error, reqClone, handler)));
  }

  private handleErrorResponse(
    error: LccError,
    req: HttpRequest<unknown>,
    handler: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (error.status === 401) {
      // Only attempt refresh if not already in progress and it's not a refresh endpoint
      // to avoid infinite loops
      if (!req.url.includes('refresh-session')) {
        return this.sessionRefresh().pipe(
          switchMap(() => handler.handle(req)),
          catchError(() => {
            this.sessionRefreshInProgress = false;
            this.store.dispatch(AuthActions.logoutRequested({ sessionExpired: true }));
            return of(EMPTY as unknown as HttpEvent<unknown>);
          }),
        );
      } else {
        // If the refresh endpoint itself returns 401, session is definitely expired
        this.sessionRefreshInProgress = false;
        this.store.dispatch(AuthActions.logoutRequested({ sessionExpired: true }));
        return of(EMPTY as unknown as HttpEvent<unknown>);
      }
    }

    return throwError(() => error);
  }

  private sessionRefresh(): Observable<unknown> {
    if (this.sessionRefreshInProgress) {
      return new Observable(observer => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next(null);
          observer.complete();
        });
      });
    } else {
      this.sessionRefreshInProgress = true;

      return this.authApiService.refreshSession().pipe(
        tap(() => {
          this.sessionRefreshInProgress = false;
          this._tokenRefreshed$.next(true);
        }),
        catchError(() => of(EMPTY)),
      );
    }
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
