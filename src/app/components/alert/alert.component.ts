import { Component, EventEmitter, Output } from '@angular/core';

import { AlertFacade } from './alert.facade';

@Component({
  selector: 'lcc-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  providers: [AlertFacade],
})
export class AlertComponent {
  @Output() close = new EventEmitter<void>();

  constructor(public facade: AlertFacade) {}

  // Set time on event date to 6:00 PM
  setTime(date: string): Date {
    const asDate = new Date(date);
    asDate.setHours(18);
    return asDate;
  }
}
