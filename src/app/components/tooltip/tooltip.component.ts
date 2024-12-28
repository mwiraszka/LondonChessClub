import { CommonModule } from '@angular/common';
import { Component, Inject, TemplateRef, ViewEncapsulation } from '@angular/core';

import { TruncateByCharsPipe } from '@app/pipes';
import { IsStringPipe } from '@app/pipes';

import { TOOLTIP_DATA_TOKEN } from './tooltip.directive';

@Component({
  selector: 'lcc-tooltip',
  template: `
    @if (tooltipData | isString) {
      <div
        class="lcc-truncate-max-5-lines"
        [style.max-width.px]="'120'">
        {{ tooltipData | truncateByChars: 80 }}
      </div>
    } @else {
      <ng-template [ngTemplateOutlet]="tooltipData"></ng-template>
    }
  `,
  styleUrl: './tooltip.component.scss',
  imports: [CommonModule, IsStringPipe, TruncateByCharsPipe],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TooltipComponent {
  constructor(
    @Inject(TOOLTIP_DATA_TOKEN) public tooltipData: string | TemplateRef<unknown>,
  ) {}
}
