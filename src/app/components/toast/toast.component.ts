import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import IconsModule from '@app/icons';
import type { Toast } from '@app/models';

@Component({
  selector: 'lcc-toast',
  styleUrl: './toast.component.scss',
  templateUrl: './toast.component.html',
  imports: [CommonModule, IconsModule],
})
export class ToastComponent implements OnInit {
  @Input() public toast?: Toast;
  public icon!: 'check-circle' | 'alert-triangle' | 'info';

  ngOnInit(): void {
    switch (this.toast?.type) {
      case 'success':
        this.icon = 'check-circle';
        break;
      case 'warning':
        this.icon = 'alert-triangle';
        break;
      default:
        this.icon = 'info';
        break;
    }
  }
}
