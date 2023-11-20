import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { AuthSelectors } from '@app/store/auth';
import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import { ClubEvent } from '@app/types';

@Injectable()
export class ScheduleFacade {
  readonly events$ = this.store.select(ScheduleSelectors.events);
  readonly nextEventId$ = this.store.select(ScheduleSelectors.nextEventId);

  readonly isLoading$ = this.store.select(ScheduleSelectors.isLoading);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);

  constructor(private readonly store: Store) {}

  loadEvents(limitToUpcoming: number | null): void {
    this.store.dispatch(ScheduleActions.loadEventsStarted({ limitToUpcoming }));
  }

  onEditEvent(eventToEdit: ClubEvent): void {
    this.store.dispatch(ScheduleActions.editEventSelected({ eventToEdit }));
  }

  onDeleteEvent(eventToDelete: ClubEvent): void {
    this.store.dispatch(ScheduleActions.deleteEventSelected({ eventToDelete }));
  }
}
