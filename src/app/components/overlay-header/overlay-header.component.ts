import { Component, EventEmitter, Output } from '@angular/core';

import { IconsModule } from '@app/icons';

@Component({
  selector: 'lcc-overlay-header',
  template: `
    <header>
      <i-feather
        name="x"
        class="close-icon"
        (click)="close.emit()">
      </i-feather>
    </header>
  `,
  styleUrls: ['./overlay-header.component.scss'],
  imports: [IconsModule],
})
export class OverlayHeaderComponent {
  @Output() close = new EventEmitter<void>();
}
