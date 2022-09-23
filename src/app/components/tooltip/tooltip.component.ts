import { Component } from '@angular/core';

@Component({
  selector: 'lcc-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  tooltip: string = '';
  left = 0;
  top = 0;

  constructor() {}
}