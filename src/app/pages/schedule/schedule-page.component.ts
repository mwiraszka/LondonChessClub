import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import { Event } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { EventsSelectors } from '@app/store/events';

@UntilDestroy()
@Component({
  selector: 'lcc-schedule-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        title="Schedule"
        icon="calendar">
      </lcc-page-header>
      <lcc-schedule
        [allEvents]="vm.allEvents"
        [isAdmin]="vm.isAdmin"
        [nextEvent]="vm.nextEvent"
        [showPastEvents]="vm.showPastEvents"
        [upcomingEvents]="vm.upcomingEvents">
      </lcc-schedule>
    }
  `,
  imports: [CommonModule, ScheduleComponent, PageHeaderComponent],
})
export class SchedulePageComponent implements OnInit {
  public viewModel$?: Observable<{
    allEvents: Event[];
    isAdmin: boolean;
    nextEvent: Event | null;
    showPastEvents: boolean;
    upcomingEvents: Event[];
  }>;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Schedule');
    this.metaAndTitleService.updateDescription(
      'Scheduled events at the London Chess Club',
    );

    this.viewModel$ = combineLatest([
      this.store.select(EventsSelectors.selectAllEvents),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(EventsSelectors.selectNextEvent),
      this.store.select(EventsSelectors.selectShowPastEvents),
      this.store.select(EventsSelectors.selectUpcomingEvents),
    ]).pipe(
      untilDestroyed(this),
      map(([allEvents, isAdmin, nextEvent, showPastEvents, upcomingEvents]) => ({
        allEvents,
        isAdmin,
        nextEvent,
        showPastEvents,
        upcomingEvents,
      })),
      tap(({ upcomingEvents }) => {
        if (upcomingEvents.length) {
          setTimeout(() => {
            const nextEvent = this._document.getElementById(upcomingEvents[0].id);
            if (nextEvent) {
              nextEvent.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
              });
            }
          }, 150);
        }
      }),
    );
  }
}
