import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ScheduleSelectors } from '@app/store/schedule';
import { UserSettingsActions } from '@app/store/user-settings';

@Injectable()
export class UpcomingEventBannerFacade {
  readonly nextEvent$ = this.store.select(ScheduleSelectors.nextEvent);

  constructor(private readonly store: Store) {}

  onClearBanner(): void {
    this.store.dispatch(UserSettingsActions.clearUpcomingEventBanner());
  }
}
