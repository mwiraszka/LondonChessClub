import { Component, OnInit } from '@angular/core';
import { ClarityIcons, eventIcon } from '@cds/core/icon';

import { MOCK_EVENTS } from './mock-events';

@Component({
  selector: 'lcc-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.scss'],
})
export class SchedulePageComponent implements OnInit {
  public mockEvents = MOCK_EVENTS;

  ngOnInit(): void {
    ClarityIcons.addIcons(eventIcon);
  }
}
