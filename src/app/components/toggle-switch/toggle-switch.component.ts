import * as uuid from 'uuid';

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TooltipDirective } from '@app/directives/tooltip.directive';

@Component({
  selector: 'lcc-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.scss',
  imports: [TooltipDirective],
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
