import { Component, OnInit } from '@angular/core';
import { ClarityIcons, eventIcon } from '@cds/core/icon';

import { MOCK_EVENTS } from './mock-events';

@Component({
  selector: 'lcc-schedule-screen',
  templateUrl: './schedule-screen.component.html',
  styleUrls: ['./schedule-screen.component.scss'],
})
export class ScheduleScreenComponent implements OnInit {
  public mockEvents = MOCK_EVENTS;

  ngOnInit(): void {
    ClarityIcons.addIcons(eventIcon);
  }
}
