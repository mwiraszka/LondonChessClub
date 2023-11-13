import { ClarityIcons, windowCloseIcon } from '@cds/core/icon';

import { Component, OnInit } from '@angular/core';

import { ModalFacade } from './modal.facade';

@Component({
  selector: 'lcc-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [ModalFacade],
})
export class ModalComponent implements OnInit {
  constructor(public facade: ModalFacade) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(windowCloseIcon);
  }
}
