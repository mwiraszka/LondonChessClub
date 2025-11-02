import { Store } from '@ngrx/store';
import { combineLatest, fromEvent, interval, merge } from 'rxjs';
import { filter, tap, throttleTime } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { SessionExpiryDialogComponent } from '@app/components/session-expiry-dialog/session-expiry-dialog.component';
import { SessionExpiryDialogResult } from '@app/models';
import { AuthActions, AuthSelectors } from '@app/store/auth';

import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class UserActivityService {
  private readonly SESSION_DURATION_MS = 29 * 60 * 1000; // 29 minutes

  private isDialogOpen = false;
  private lastActivityTime = Date.now();

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  public monitorSessionExpiry(): void {
    const activityEvents$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'touchstart'),
    ).pipe(
      throttleTime(10_000),
      tap(() => (this.lastActivityTime = Date.now())),
    );

    combineLatest([
      this.store.select(AuthSelectors.selectSessionStartTime),
      merge(activityEvents$, interval(10_000)),
    ])
      .pipe(filter(([sessionStartTime]) => !!sessionStartTime))
      .subscribe(([sessionStartTime]) => {
        const timeElapsed = Date.now() - sessionStartTime!;
        const timeSinceActivity = Date.now() - this.lastActivityTime;

        if (this.isDialogOpen) {
          return;
        }

        if (
          timeElapsed > this.SESSION_DURATION_MS * 0.5 &&
          timeSinceActivity < 2 * 60 * 1000
        ) {
          this.store.dispatch(AuthActions.sessionRefreshRequested());
        }

        if (timeElapsed > this.SESSION_DURATION_MS * 0.9) {
          this.showWarningDialog();
        }
      });
  }

  private async showWarningDialog(): Promise<void> {
    this.isDialogOpen = true;

    const dialogResult = await this.dialogService.open<
      SessionExpiryDialogComponent,
      SessionExpiryDialogResult
    >({
      componentType: SessionExpiryDialogComponent,
      inputs: { sessionDurationMs: this.SESSION_DURATION_MS },
      isModal: false,
    });

    this.isDialogOpen = false;

    if (dialogResult === 'logout') {
      this.store.dispatch(AuthActions.logoutRequested({ sessionExpired: false }));
    } else {
      this.store.dispatch(AuthActions.sessionRefreshRequested());
    }
  }
}
