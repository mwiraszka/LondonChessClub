import { Component, OnInit } from '@angular/core';

import { ToasterFacade } from './toaster.facade';

@Component({
  selector: 'lcc-toaster',
  template: `
    <div *ngFor="let toast of facade.toasts$ | async">
      <lcc-toast [toast]="toast"></lcc-toast>
    </div>
  `,
  styleUrls: ['./toaster.component.scss'],
})
export class ToasterComponent {
  constructor(public facade: ToasterFacade) {}
}
