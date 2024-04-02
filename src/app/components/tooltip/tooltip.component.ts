import { Component } from '@angular/core';

@Component({
  selector: 'lcc-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  // Set in via setTooltipPlacement() in tooltip directive
  tooltip: string | null = null;
  left = 0;
  top = 0;
  width = 120;
}
