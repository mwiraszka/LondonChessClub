import { Component } from '@angular/core';

import { ModalFacade } from './modal.facade';

@Component({
  selector: 'lcc-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [ModalFacade],
})
export class ModalComponent {
  constructor(public facade: ModalFacade) {}
}
