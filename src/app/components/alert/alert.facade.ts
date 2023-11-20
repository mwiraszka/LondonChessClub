import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { NavActions } from '@app/store/nav';
import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class AlertFacade {
  upcomingEvent$ = this.store.select(ScheduleSelectors.upcomingEvent);

  constructor(private readonly store: Store) {}

  onDetails(): void {
    this.store.dispatch(NavActions.scheduleNavigationRequested());
  }
}
