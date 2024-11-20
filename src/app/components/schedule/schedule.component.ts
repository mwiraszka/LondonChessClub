import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatestWith } from 'rxjs/operators';

import { Component, Input, OnInit } from '@angular/core';

import { ClubEvent, type Link, NavPathTypes } from '@app/types';
import { kebabize } from '@app/utils';

import { ScheduleFacade } from './schedule.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [ScheduleFacade],
})
export class ScheduleComponent implements OnInit {
  readonly NavPathTypes = NavPathTypes;
  readonly kebabize = kebabize;

  @Input() includeDetails = true;
  @Input() allowTogglePastEvents = true;
  @Input() limitToUpcoming?: number;

  shownEvents?: ClubEvent[];
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
      .subscribe(([allEvents, upcomingEvents, showPastEvents]) => {
        this.shownEvents =
          showPastEvents && this.allowTogglePastEvents
            ? allEvents
            : upcomingEvents.slice(0, this.limitToUpcoming);
      });
  }
}
