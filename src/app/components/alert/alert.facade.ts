import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class AlertFacade {
  upcomingEvent$ = this.store.select(ScheduleSelectors.upcomingEvent);

  constructor(private readonly store: Store) {}
}
