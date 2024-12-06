import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatestWith } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { type Event, type Link, NavPathTypes } from '@app/types';
import { kebabize } from '@app/utils';

import { ScheduleFacade } from './schedule.facade';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [ScheduleFacade],
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
  readonly NavPathTypes = NavPathTypes;
  readonly kebabize = kebabize;

  @Input() includeDetails = true;
  @Input() allowTogglePastEvents = true;
  @Input() upcomingEventLimit?: number;

  shownEvents?: Event[];
  addEventLink: Link = {
    path: NavPathTypes.EVENT + '/' + NavPathTypes.ADD,
    text: 'Add an event',
    icon: 'plus-circle',
  };

  constructor(public facade: ScheduleFacade) {}

  ngOnInit(): void {
    this.facade.fetchEvents();

    this.facade.events$
      .pipe(
        untilDestroyed(this),
        combineLatestWith(this.facade.upcomingEvents$, this.facade.showPastEvents$),
      )
      .subscribe(([events, upcomingEvents, showPastEvents]) => {
        this.shownEvents =
          showPastEvents && this.allowTogglePastEvents
            ? events
            : upcomingEvents.slice(0, this.upcomingEventLimit);
      });
  }
}
