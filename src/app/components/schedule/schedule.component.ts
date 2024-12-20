import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { EventsActions, EventsSelectors } from '@app/store/events';
import { type Event, type Link, NavPathTypes } from '@app/types';
import { kebabize } from '@app/utils';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  imports: [
    AdminControlsComponent,
    CommonModule,
    FormatDatePipe,
    IconsModule,
    LinkListComponent,
    RouterLink,
  ],
})
export class ScheduleComponent implements OnInit {
  public readonly NavPathTypes = NavPathTypes;
  public readonly kebabize = kebabize;

  @Input() public allowTogglePastEvents = true;
  @Input() public includeDetails = true;
  @Input() public upcomingEventLimit?: number;

  public readonly addEventLink: Link = {
    path: NavPathTypes.EVENT + '/' + NavPathTypes.ADD,
    text: 'Add an event',
    icon: 'plus-circle',
  };
  public readonly scheduleViewModel$ = this.store.select(
    EventsSelectors.selectScheduleViewModel,
  );

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  public fetchEvents(): void {
    this.store.dispatch(EventsActions.fetchEventsRequested());
  }

  public onDeleteEvent(event: Event): void {
    this.store.dispatch(EventsActions.deleteEventSelected({ event }));
  }

  public onTogglePastEvents(): void {
    this.store.dispatch(EventsActions.pastEventsToggled());

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
