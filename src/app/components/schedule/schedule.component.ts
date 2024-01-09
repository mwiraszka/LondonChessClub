import { Component, Input, OnInit } from '@angular/core';

import { LoaderService } from '@app/services';
import { ClubEvent, Link, NavPathTypes } from '@app/types';
import { kebabize, setLocalTime } from '@app/utils';

import { ScheduleFacade } from './schedule.facade';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [ScheduleFacade],
})
export class ScheduleComponent implements OnInit {
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

  constructor(public facade: ScheduleFacade, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.facade.isLoading$.subscribe(isLoading => {
      this.loaderService.display(isLoading);
    });
    this.facade.loadEvents();
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
