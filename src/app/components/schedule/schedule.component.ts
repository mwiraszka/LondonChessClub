import { Component, Input, OnInit } from '@angular/core';

import { LoaderService } from '@app/services';
import { ClubEvent, Link, NavPathTypes } from '@app/types';
import { formatDate, kebabize } from '@app/utils';

import { ScheduleFacade } from './schedule.facade';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [ScheduleFacade],
})
export class ScheduleComponent implements OnInit {
  formatDate = formatDate;
  kebabize = kebabize;

  @Input() includeDetails = true;
  @Input() maxEvents?: number;

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
}
