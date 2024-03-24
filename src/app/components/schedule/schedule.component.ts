import { Component, Input, OnInit } from '@angular/core';

import { type ClubEvent, type Link, NavPathTypes } from '@app/types';
import { kebabize, setLocalTime } from '@app/utils';

import { ScheduleFacade } from './schedule.facade';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [ScheduleFacade],
})
export class ScheduleComponent implements OnInit {
  NavPathTypes = NavPathTypes;
  kebabize = kebabize;
  setLocalTime = setLocalTime;

  @Input() includeDetails = true;
  @Input() allowTogglePastEvents = true;
  @Input() limitToUpcoming?: number;

  showPast = false;

  addEventLink: Link = {
    path: NavPathTypes.EVENT_ADD,
    text: 'Add new event',
    iconShape: 'plus-circle',
  };

  constructor(public facade: ScheduleFacade) {}

  ngOnInit(): void {
    this.facade.fetchEvents();
  }

  trackByFn = (index: number, event: ClubEvent) => event.id;

  onShowHidePastEvents(): void {
    this.showPast = !this.showPast;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
