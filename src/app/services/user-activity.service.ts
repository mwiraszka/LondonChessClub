import { Store } from '@ngrx/store';
import { combineLatest, fromEvent, interval, merge } from 'rxjs';
import { filter, throttleTime } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { SessionExpiryDialogComponent } from '@app/components/session-expiry-dialog/session-expiry-dialog.component';
import { SessionExpiryDialogResult } from '@app/models';
import { AuthActions, AuthSelectors } from '@app/store/auth';

import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class UserActivityService {
  public static readonly SESSION_DURATION_MS = 29 * 60 * 1000; // 29 minutes

  public static readonly MAX_INACTIVITY_DURATION_FOR_AUTO_REFRESH_MS = 9 * 60 * 1000; // 9 minutes
  public static readonly MIN_SESSION_DURATION_FOR_AUTO_REFRESH_MS = 10 * 60 * 1000; // 10 minutes
  public static readonly MIN_SESSION_DURATION_FOR_WARNING_DIALOG_MS = 20 * 60 * 1000; // 20 minutes

  public static readonly SESSION_CHECK_INTERVAL_MS = 10 * 1000; // 10 seconds

  private isDialogOpen = false;
  private lastActivityTime: number | null = null;

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  public monitorSessionExpiry(): void {
    merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'touchstart'),
    )
      .pipe(throttleTime(UserActivityService.SESSION_CHECK_INTERVAL_MS))
      .subscribe(() => (this.lastActivityTime = Date.now()));

    combineLatest([
      this.store.select(AuthSelectors.selectSessionStartTime),
      interval(UserActivityService.SESSION_CHECK_INTERVAL_MS),
    ])
      .pipe(filter(([sessionStartTime]) => !!sessionStartTime))
      .subscribe(([sessionStartTime]) => {
        const timeElapsed = Date.now() - sessionStartTime!;

        if (this.isDialogOpen) {
          return;
        }

        if (
          this.lastActivityTime !== null &&
          timeElapsed > UserActivityService.MIN_SESSION_DURATION_FOR_AUTO_REFRESH_MS &&
          Date.now() - this.lastActivityTime <
            UserActivityService.MAX_INACTIVITY_DURATION_FOR_AUTO_REFRESH_MS
        ) {
          this.store.dispatch(AuthActions.sessionRefreshRequested());
        }

        if (
          timeElapsed > UserActivityService.MIN_SESSION_DURATION_FOR_WARNING_DIALOG_MS
        ) {
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
      inputs: { sessionDurationMs: UserActivityService.SESSION_DURATION_MS },
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
