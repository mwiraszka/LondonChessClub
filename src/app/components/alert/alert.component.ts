import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ClarityIcons, windowCloseIcon } from '@cds/core/icon';

import { AlertFacade } from './alert.facade';

@Component({
  selector: 'lcc-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  providers: [AlertFacade],
})
export class AlertComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor(public facade: AlertFacade) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(windowCloseIcon);
  }
}
