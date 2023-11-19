import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ScheduleActions } from '@app/store/schedule';
import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class AlertFacade {
  nextEvent$ = this.store.select(ScheduleSelectors.nextEvent);

  constructor(private store: Store) {}

  onDetails(eventId: string): void {
    this.store.dispatch(ScheduleActions.alertDetailsSelected({ eventId }));
  }
}
