import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { NavActions } from '@app/store/nav';
import { ScheduleSelectors } from '@app/store/schedule';

@Injectable()
export class AlertFacade {
  alertMessage$ = this.store
    .select(ScheduleSelectors.nextEvent)
    .pipe(map((event) => `Upcoming: ${event.title} on ${event.eventDate}`));

  constructor(private store: Store) {}

  onClickAction(): void {
    this.store.dispatch(NavActions.scheduleNavigationRequested());
  }
}
