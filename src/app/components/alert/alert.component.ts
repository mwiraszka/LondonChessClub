import { Component, EventEmitter, Output } from '@angular/core';

import { NavPathTypes } from '@app/types';
import { setLocalTime } from '@app/utils';

import { AlertFacade } from './alert.facade';

@Component({
  selector: 'lcc-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  providers: [AlertFacade],
})
export class AlertComponent {
  readonly setLocalTime = setLocalTime;
  readonly NavPathTypes = NavPathTypes;

  @Output() close = new EventEmitter<void>();

  constructor(public facade: AlertFacade) {}
}
