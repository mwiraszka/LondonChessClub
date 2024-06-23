import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ScheduleSelectors } from '@app/store/schedule';
import { UserSettingsActions } from '@app/store/user-settings';

@Injectable()
export class UpcomingEventBannerFacade {
  upcomingEvent$ = this.store.select(ScheduleSelectors.upcomingEvent);

  constructor(private readonly store: Store) {}

  onClearBanner(): void {
    this.store.dispatch(UserSettingsActions.clearUpcomingEventBanner());
  }
}
