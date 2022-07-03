import { Component, Input } from '@angular/core';

import { ClubEvent } from '@app/screens/schedule';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent {
  @Input() events: ClubEvent[];
}
