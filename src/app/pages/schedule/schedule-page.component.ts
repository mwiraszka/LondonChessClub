import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { AdminToolbarComponent } from '@app/components/admin-toolbar/admin-toolbar.component';
import { DataToolbarComponent } from '@app/components/data-toolbar/data-toolbar.component';
import { EventsTableComponent } from '@app/components/events-table/events-table.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { DataPaginationOptions, Event, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { AuthSelectors } from '@app/store/auth';
import { EventsActions, EventsSelectors } from '@app/store/events';

@UntilDestroy()
@Component({
  selector: 'lcc-schedule-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        title="Schedule"
        icon="calendar_month">
      </lcc-page-header>

      @if (vm.isAdmin) {
        <lcc-admin-toolbar [adminLinks]="[addEventLink]"></lcc-admin-toolbar>
      }

      <lcc-data-toolbar
        entity="event"
        [filteredCount]="vm.filteredCount"
        [options]="vm.options"
        searchPlaceholder="Search by event type or name"
        (optionsChange)="onOptionsChange($event)"
        (optionsChangeNoFetch)="onOptionsChange($event, false)">
      </lcc-data-toolbar>

      @if (vm.filteredCount) {
        <lcc-events-table
          [events]="vm.filteredEvents"
          [isAdmin]="vm.isAdmin"
          [nextEvent]="vm.nextEvent"
          [options]="vm.options"
          [showModificationInfo]="vm.isAdmin"
          (requestDeleteEvent)="onRequestDeleteEvent($event)">
        </lcc-events-table>
      }
    }
  `,
  imports: [
    AdminToolbarComponent,
    CommonModule,
    DataToolbarComponent,
    EventsTableComponent,
    PageHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent implements OnInit {
  public readonly addEventLink: InternalLink = {
    text: 'Add an event',
    internalPath: ['event', 'add'],
    icon: 'add_circle_outline',
  };

  public viewModel$?: Observable<{
    filteredCount: number | null;
    filteredEvents: Event[];
    isAdmin: boolean;
    nextEvent: Event | null;
    options: DataPaginationOptions<Event>;
  }>;

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Schedule');
    this.metaAndTitleService.updateDescription(
      'Scheduled events at the London Chess Club',
    );

    this.viewModel$ = combineLatest([
      this.store.select(EventsSelectors.selectFilteredCount),
      this.store.select(EventsSelectors.selectFilteredEvents),
      this.store.select(AuthSelectors.selectIsAdmin),
      this.store.select(EventsSelectors.selectNextEvent),
      this.store.select(EventsSelectors.selectOptions),
    ]).pipe(
      untilDestroyed(this),
      map(([filteredCount, filteredEvents, isAdmin, nextEvent, options]) => ({
        filteredCount,
        filteredEvents,
        isAdmin,
        nextEvent,
        options,
      })),
    );
  }

  public onOptionsChange(options: DataPaginationOptions<Event>, fetch = true): void {
    this.store.dispatch(EventsActions.paginationOptionsChanged({ options, fetch }));
  }

  public onRequestDeleteEvent(event: Event): void {
    this.store.dispatch(EventsActions.deleteEventRequested({ event }));
  }
}
