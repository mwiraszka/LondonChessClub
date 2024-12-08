import { Store } from '@ngrx/store';

import { Injectable } from '@angular/core';

import { AuthSelectors } from '@app/store/auth';
import { EventsActions, EventsSelectors } from '@app/store/events';
import type { Event } from '@app/types';

@Injectable()
export class ScheduleFacade {
  readonly events$ = this.store.select(EventsSelectors.events);
  readonly isAdmin$ = this.store.select(AuthSelectors.isAdmin);
  readonly nextEvent$ = this.store.select(EventsSelectors.nextEvent);
  readonly showPastEvents$ = this.store.select(EventsSelectors.showPastEvents);
  readonly upcomingEvents$ = this.store.select(EventsSelectors.upcomingEvents);

  constructor(private readonly store: Store) {}

  fetchEvents(): void {
    this.store.dispatch(EventsActions.fetchEventsRequested());
  }

  onDeleteEvent(event: Event): void {
    this.store.dispatch(EventsActions.deleteEventSelected({ event }));
  }

  onTogglePastEvents(): void {
    this.store.dispatch(EventsActions.togglePastEvents());

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
