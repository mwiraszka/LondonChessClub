import { Component, Input, OnInit } from '@angular/core';

import { type Toast, ToastTypes } from '@app/types';

@Component({
  selector: 'lcc-toast',
  styleUrls: ['./toast.component.scss'],
  templateUrl: './toast.component.html',
})
export class ToastComponent implements OnInit {
  @Input() toast?: Toast;
  iconShape!: 'check-circle' | 'alert-triangle' | 'info';

  ngOnInit(): void {
    switch (this.toast?.type) {
      case ToastTypes.SUCCESS:
        this.iconShape = 'check-circle';
        break;
      case ToastTypes.WARNING:
        this.iconShape = 'alert-triangle';
        break;
      default:
        this.iconShape = 'info';
        break;
    }
  }
}
