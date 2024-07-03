import { Component } from '@angular/core';

import { ToasterFacade } from './toaster.facade';

@Component({
  selector: 'lcc-toaster',
  template: `
    @for (toast of facade.toasts$ | async; track toast.title) {
      <lcc-toast [toast]="toast"></lcc-toast>
    }
  `,
  styleUrls: ['./toaster.component.scss'],
  providers: [ToasterFacade],
})
export class ToasterComponent {
  constructor(public facade: ToasterFacade) {}
}
