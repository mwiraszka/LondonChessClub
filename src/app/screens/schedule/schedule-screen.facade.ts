import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class ScheduleScreenFacade {
  readonly nextEventId$ = this.store.select(ScheduleSelectors.nextEventId);

  constructor(private readonly store: Store) {}
}
