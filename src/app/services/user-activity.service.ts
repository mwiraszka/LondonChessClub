import { Store } from '@ngrx/store';
import { combineLatest, fromEvent, interval, merge } from 'rxjs';
import { filter, map, throttleTime } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { SessionExpiryDialogComponent } from '@app/components/session-expiry-dialog/session-expiry-dialog.component';
import { SessionExpiryDialogResult } from '@app/models';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { isDefined } from '@app/utils';

import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class UserActivityService {
  public static readonly SESSION_DURATION_MS = 10_500_000; // 2 hours 55 minutes
  public static readonly MAX_INACTIVITY_DURATION_FOR_AUTO_REFRESH_MS = 600_000; // 10 minutes
  public static readonly MIN_SESSION_DURATION_FOR_AUTO_REFRESH_MS = 900_000; // 15 minutes
  public static readonly MIN_SESSION_DURATION_FOR_WARNING_DIALOG_MS = 9_000_000; // 2 hours 30 minutes
  public static readonly SESSION_CHECK_INTERVAL_MS = 60_000; // 1 minute

  private isDialogOpen = false;
  private lastActivityTime: number | null = null;

  constructor(
    private readonly dialogService: DialogService,
    private readonly store: Store,
  ) {}

  public monitorSessionExpiry(): void {
    // Reset state when user logs out
    this.store
      .select(AuthSelectors.selectSessionStartTime)
      .subscribe(sessionStartTime => {
        if (!isDefined(sessionStartTime)) {
          this.lastActivityTime = null;
          this.isDialogOpen = false;
        }
      });

    // Monitor user activity events
    merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'touchstart'),
    )
      .pipe(throttleTime(UserActivityService.SESSION_CHECK_INTERVAL_MS))
      .subscribe(() => (this.lastActivityTime = Date.now()));

    // Monitor session and perform checks on interval
    combineLatest([
      this.store.select(AuthSelectors.selectSessionStartTime),
      interval(UserActivityService.SESSION_CHECK_INTERVAL_MS),
    ])
      .pipe(
        filter(([sessionStartTime]) => isDefined(sessionStartTime)),
        map(([sessionStartTime]) => Date.now() - sessionStartTime!),
      )
      .subscribe(timeElapsedMs => this.performSessionCheck(timeElapsedMs));
  }

  private performSessionCheck(timeElapsedMs: number): void {
    if (this.isDialogOpen) {
      return;
    }

    if (
      this.lastActivityTime !== null &&
      timeElapsedMs > UserActivityService.MIN_SESSION_DURATION_FOR_AUTO_REFRESH_MS &&
      Date.now() - this.lastActivityTime <
        UserActivityService.MAX_INACTIVITY_DURATION_FOR_AUTO_REFRESH_MS
    ) {
      this.store.dispatch(AuthActions.sessionRefreshRequested());
    }

    if (timeElapsedMs > UserActivityService.MIN_SESSION_DURATION_FOR_WARNING_DIALOG_MS) {
      const initialTimeRemainingSecs = Math.floor(
        (UserActivityService.SESSION_DURATION_MS - timeElapsedMs) / 1000,
      );

      this.showWarningDialog(initialTimeRemainingSecs);
    }
  }

  private async showWarningDialog(initialTimeRemainingSecs: number): Promise<void> {
    this.isDialogOpen = true;

    const dialogResult = await this.dialogService.open<
      SessionExpiryDialogComponent,
      SessionExpiryDialogResult
    >({
      componentType: SessionExpiryDialogComponent,
      inputs: { initialTimeRemainingSecs },
      isModal: false,
    });

    if (dialogResult === 'logout' || dialogResult === 'expire') {
      this.store.dispatch(
        AuthActions.logoutRequested({ sessionExpired: dialogResult === 'expire' }),
      );
      return;
    }

    this.store.dispatch(AuthActions.sessionRefreshRequested());
    this.isDialogOpen = false;
  }
}
