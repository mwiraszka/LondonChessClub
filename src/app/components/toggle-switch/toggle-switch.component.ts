import * as uuid from 'uuid';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';

@Component({
  selector: 'lcc-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
  imports: [CommonModule, TooltipDirective],
})
export class ToggleSwitchComponent {
  @Input() condition?: boolean | null;
  @Input() tooltipTextWhenOn?: string;
  @Input() tooltipTextWhenOff?: string;

  uniqueId!: string;

  @Output() toggle = new EventEmitter<boolean>();

  constructor() {
    this.uniqueId = uuid.v4().slice(-8);
  }
}
