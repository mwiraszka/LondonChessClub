import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { EventsSelectors } from '@app/store/events';
import { UserSettingsActions } from '@app/store/user-settings';

@Injectable()
export class UpcomingEventBannerFacade {
  readonly nextEvent$ = this.store.select(EventsSelectors.nextEvent);

  constructor(private readonly store: Store) {}

  onClearBanner(): void {
    this.store.dispatch(UserSettingsActions.clearUpcomingEventBanner());
  }
}
