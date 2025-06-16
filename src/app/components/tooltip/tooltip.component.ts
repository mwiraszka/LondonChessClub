import { CommonModule } from '@angular/common';
import { Component, Inject, TemplateRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TOOLTIP_DATA_TOKEN } from '@app/directives/tooltip.directive';
import { TruncateByCharsPipe } from '@app/pipes';
import { IsStringPipe } from '@app/pipes';

@Component({
  selector: 'lcc-tooltip',
  template: `
    @if (tooltipData | isString) {
      <div class="lcc-truncate-max-5-lines">
        {{ tooltipData | truncateByChars: 80 }}
      </div>
    } @else {
      <ng-template [ngTemplateOutlet]="tooltipData"></ng-template>
    }
  `,
  styleUrl: './tooltip.component.scss',
  imports: [CommonModule, IsStringPipe, MatIconModule, TruncateByCharsPipe],
})
export class TooltipComponent {
  constructor(
    @Inject(TOOLTIP_DATA_TOKEN) public tooltipData: string | TemplateRef<unknown>,
  ) {}
}
