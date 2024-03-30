import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatestWith, first } from 'rxjs';

import { Component, Input, OnInit } from '@angular/core';

import { type ClubEvent, type Link, NavPathTypes } from '@app/types';
import { kebabize, setLocalTime } from '@app/utils';

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
  readonly setLocalTime = setLocalTime;

  @Input() includeDetails = true;
  @Input() allowTogglePastEvents = true;
  @Input() limitToUpcoming?: number;

  private _showPast$ = new BehaviorSubject<boolean>(false);
  public showPast$ = this._showPast$.asObservable();

  shownEvents?: ClubEvent[];
  addEventLink: Link = {
    path: NavPathTypes.EVENT_ADD,
    text: 'Add new event',
    iconShape: 'plus-circle',
  };

  constructor(public facade: ScheduleFacade) {}

  ngOnInit(): void {
    this.facade.fetchEvents();

    this.facade.events$
      .pipe(
        untilDestroyed(this),
        combineLatestWith(this.facade.upcomingEvents$, this.showPast$),
      )
      .subscribe(([allEvents, upcomingEvents, showPast]) => {
        this.shownEvents = showPast
          ? allEvents
          : upcomingEvents?.slice(0, this.limitToUpcoming);
      });
  }

  onShowHidePastEvents(): void {
    this.showPast$.pipe(first()).subscribe(showPast => {
      this._showPast$.next(!showPast);
    });

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
