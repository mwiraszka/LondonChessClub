import { Component, OnInit } from '@angular/core';
import { ClarityIcons, eventIcon } from '@cds/core/icon';

import { MOCK_EVENTS } from './mock-events';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  public mockEvents = MOCK_EVENTS;

  ngOnInit(): void {
    ClarityIcons.addIcons(eventIcon);
  }
}
