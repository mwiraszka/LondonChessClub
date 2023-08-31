import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { NavActions } from '@app/store/nav';
import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class AlertFacade {
  nextEvent$ = this.store.select(ScheduleSelectors.nextEvent);

  constructor(private store: Store) {}

  onClickAction(): void {
    this.store.dispatch(NavActions.scheduleNavigationRequested());
  }
}
