import { Component, EventEmitter, Output } from '@angular/core';

import { NavPathTypes } from '@app/types';
import { kebabize, setLocalTime } from '@app/utils';

import { EventAlertFacade } from './event-alert.facade';

@Component({
  selector: 'lcc-alert',
  templateUrl: './event-alert.component.html',
  styleUrls: ['./event-alert.component.scss'],
  providers: [EventAlertFacade],
})
export class EventAlertComponent {
  readonly kebabize = kebabize;
  readonly setLocalTime = setLocalTime;
  readonly NavPathTypes = NavPathTypes;

  @Output() close = new EventEmitter<void>();

  constructor(public facade: EventAlertFacade) {}
}
