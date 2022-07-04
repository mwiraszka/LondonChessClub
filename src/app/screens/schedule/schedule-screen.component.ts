import { Component } from '@angular/core';

import { MOCK_EVENTS } from './mock-events';

@Component({
  selector: 'lcc-schedule-screen',
  templateUrl: './schedule-screen.component.html',
  styleUrls: ['./schedule-screen.component.scss'],
})
export class ScheduleScreenComponent {
  public mockEvents = MOCK_EVENTS;
}
