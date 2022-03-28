import { Component, OnInit } from '@angular/core';
import { ClarityIcons, windowCloseIcon } from '@cds/core/icon';

@Component({
  selector: 'lcc-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent implements OnInit {
  message = "Registration for this Thursday's Blitz tournament NOW OPEN";
  action = 'Register now';

  constructor() {}

  ngOnInit(): void {
    ClarityIcons.addIcons(windowCloseIcon);
  }
}
