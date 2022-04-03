import { Component, OnInit } from '@angular/core';
import { ClarityIcons, windowCloseIcon } from '@cds/core/icon';

@Component({
  selector: 'lcc-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  message = "Registration for this Thursday's Blitz tournament now open";
  action = 'Register now';

  constructor() {}

  ngOnInit(): void {
    ClarityIcons.addIcons(windowCloseIcon);
  }

  onAction(): void {
    console.log('::: alert action clicked');
  }

  onDismiss(): void {
    console.log('::: alert dismissed');
  }
}
