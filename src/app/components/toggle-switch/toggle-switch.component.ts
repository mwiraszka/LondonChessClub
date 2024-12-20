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
  @Input() public condition?: boolean | null;
  @Input() public tooltipTextWhenOn?: string;
  @Input() public tooltipTextWhenOff?: string;

  public uniqueId!: string;

  @Output() public toggle = new EventEmitter<boolean>();

  constructor() {
    this.uniqueId = uuid.v4().slice(-8);
  }
}
