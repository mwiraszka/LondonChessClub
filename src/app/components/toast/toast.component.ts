import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { IconsModule } from '@app/icons';
import { type Toast, ToastTypes } from '@app/types';

@Component({
  selector: 'lcc-toast',
  styleUrls: ['./toast.component.scss'],
  templateUrl: './toast.component.html',
  imports: [CommonModule, IconsModule],
})
export class ToastComponent implements OnInit {
  @Input() public toast?: Toast;
  public icon!: 'check-circle' | 'alert-triangle' | 'info';

  ngOnInit(): void {
    switch (this.toast?.type) {
      case ToastTypes.SUCCESS:
        this.icon = 'check-circle';
        break;
      case ToastTypes.WARNING:
        this.icon = 'alert-triangle';
        break;
      default:
        this.icon = 'info';
        break;
    }
  }
}
