import { Component } from '@angular/core';

import { MOCK_EVENTS } from './mock-events';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  public mockEvents = MOCK_EVENTS;
}
