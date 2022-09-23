import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthSelectors } from '@app/store/auth';
import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import { ClubEvent } from '@app/types';

@Injectable()
export class ScheduleFacade {
  readonly events$ = this.store.select(ScheduleSelectors.events);
  readonly isLoading$ = this.store.select(ScheduleSelectors.isLoading);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);

  constructor(private readonly store: Store) {}

  loadEvents(): void {
    this.store.dispatch(ScheduleActions.loadEventsStarted());
  }

  onAddEvent(): void {
    this.store.dispatch(ScheduleActions.createEventSelected());
  }

  onEditEvent(eventToEdit: ClubEvent): void {
    this.store.dispatch(ScheduleActions.editEventSelected({ eventToEdit }));
  }

  onDeleteEvent(eventToDelete: ClubEvent): void {
    this.store.dispatch(ScheduleActions.deleteEventSelected({ eventToDelete }));
  }
}