import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { IconsModule } from '@app/icons';

import { ModalFacade } from './modal.facade';

@Component({
  selector: 'lcc-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [ModalFacade],
  imports: [CommonModule, IconsModule],
})
export class ModalComponent {
  constructor(public facade: ModalFacade) {}
}
