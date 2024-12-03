import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class ScheduleScreenFacade {
  readonly upcomingEvents$ = this.store.select(ScheduleSelectors.upcomingEvents);

  constructor(private readonly store: Store) {}
}
