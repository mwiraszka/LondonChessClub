import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

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
  imports: [CommonModule, IsStringPipe, TruncateByCharsPipe],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class TooltipComponent implements OnInit {
  constructor(
    @Inject(TOOLTIP_DATA_TOKEN) public tooltipData: string | TemplateRef<unknown>,
  ) {}

  // Short delay to allow stylesheet to load prior to rendering text;
  // otherwise brief flickering of unstyled tooltip text can be seen on rapid mousemove events
  @HostBinding('style.visibility') private visibility = 'hidden';

  ngOnInit(): void {
    setTimeout(() => (this.visibility = 'visible'), 30);
  }
}
