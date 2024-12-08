import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { EventsSelectors } from '@app/store/events';

@Injectable()
export class ScheduleScreenFacade {
  readonly upcomingEvents$ = this.store.select(EventsSelectors.upcomingEvents);

  constructor(private readonly store: Store) {}
}
