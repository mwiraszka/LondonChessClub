import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TruncateByCharsPipe } from '@app/pipes/truncate-by-chars.pipe';

@Component({
  selector: 'lcc-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  imports: [CommonModule, TruncateByCharsPipe],
})
export class TooltipComponent {
  // Set in via setTooltipPlacement() in tooltip directive
  tooltip: string | null = null;
  left = 0;
  top = 0;
  width = 120;
}
