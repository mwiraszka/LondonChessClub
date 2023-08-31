import {
  ClarityIcons,
  checkCircleIcon,
  exclamationCircleIcon,
  exclamationTriangleIcon,
} from '@cds/core/icon';

import { Component, Input, OnInit } from '@angular/core';

import { Toast, ToastTypes } from '@app/types';

@Component({
  selector: 'lcc-toast',
  styleUrls: ['./toast.component.scss'],
  templateUrl: './toast.component.html',
})
export class ToastComponent implements OnInit {
  @Input() toast?: Toast;
  iconShape?: 'check-circle' | 'exclamation-circle' | 'exclamation-triangle';

  ngOnInit(): void {
    ClarityIcons.addIcons(
      checkCircleIcon,
      exclamationCircleIcon,
      exclamationTriangleIcon,
    );
    switch (this.toast?.type) {
      case ToastTypes.SUCCESS:
        this.iconShape = 'check-circle';
        break;
      case ToastTypes.WARNING:
        this.iconShape = 'exclamation-circle';
        break;
      default:
        this.iconShape = 'exclamation-triangle';
        break;
    }
  }
}
