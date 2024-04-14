import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { AuthSelectors } from '@app/store/auth';
import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import type { ClubEvent } from '@app/types';

@Injectable()
export class ScheduleFacade {
  readonly events$ = this.store.select(ScheduleSelectors.events);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);
  readonly nextEventId$ = this.store.select(ScheduleSelectors.nextEventId);
  readonly upcomingEvents$ = this.store.select(ScheduleSelectors.upcomingEvents);

  constructor(private readonly store: Store) {}

  fetchEvents(): void {
    this.store.dispatch(ScheduleActions.fetchEventsRequested());
  }

  onDeleteEvent(event: ClubEvent): void {
    this.store.dispatch(ScheduleActions.deleteEventSelected({ event }));
  }
}
