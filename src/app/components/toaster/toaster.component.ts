import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ToastComponent } from '../toast/toast.component';
import { ToasterFacade } from './toaster.facade';

@Component({
  standalone: true,
  selector: 'lcc-toaster',
  template: `
    @for (toast of facade.toasts$ | async; track toast.title) {
      <lcc-toast [toast]="toast"></lcc-toast>
    }
  `,
  styleUrls: ['./toaster.component.scss'],
  providers: [ToasterFacade],
  imports: [CommonModule, ToastComponent],
})
export class ToasterComponent {
  constructor(public facade: ToasterFacade) {}
}
