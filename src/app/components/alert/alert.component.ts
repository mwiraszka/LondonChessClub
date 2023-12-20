import { Component, EventEmitter, Output } from '@angular/core';

import { setLocalTime } from '@app/utils';

import { AlertFacade } from './alert.facade';

@Component({
  selector: 'lcc-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  providers: [AlertFacade],
})
export class AlertComponent {
  setLocalTime = setLocalTime;

  @Output() close = new EventEmitter<void>();

  constructor(public facade: AlertFacade) {}
}
