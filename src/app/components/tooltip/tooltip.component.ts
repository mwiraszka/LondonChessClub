import { CommonModule } from '@angular/common';
import { Component, Inject, TemplateRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TOOLTIP_CONTENT_TOKEN } from '@app/directives';
import { TruncateByCharsPipe } from '@app/pipes';
import { IsStringPipe } from '@app/pipes';

@Component({
  selector: 'lcc-tooltip',
  template: `
    @if (tooltipContent | isString) {
      <div class="lcc-truncate-max-5-lines">
        {{ tooltipContent | truncateByChars: 80 }}
      </div>
    } @else {
      <ng-template [ngTemplateOutlet]="tooltipContent"></ng-template>
    }
  `,
  styleUrl: './tooltip.component.scss',
  imports: [CommonModule, IsStringPipe, MatIconModule, TruncateByCharsPipe],
})
export class TooltipComponent {
  constructor(
    @Inject(TOOLTIP_CONTENT_TOKEN) public tooltipContent: string | TemplateRef<unknown>,
  ) {}
}
