import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import IconsModule from '@app/icons';
import { Event } from '@app/models';
import { FormatDatePipe, KebabCasePipe } from '@app/pipes';

@Component({
  selector: 'lcc-upcoming-event-banner',
  template: `
    <div
      class="container"
      [ngClass]="nextEvent.type | kebabCase">
      <div class="banner-message-container">
        <a
          class="banner-message"
          routerLink="/schedule"
          (click)="clearBanner.emit()">
          <span>
            Next event: <b>{{ nextEvent.title }}</b> on
            <b>{{ nextEvent.eventDate | formatDate: 'short' }}</b>
          </span>
        </a>

        <button
          class="close-button lcc-icon-button"
          (click)="clearBanner.emit()">
          <i-feather
            name="x"
            class="close-icon">
          </i-feather>
        </button>
      </div>
    </div>
  `,
  styleUrl: './upcoming-event-banner.component.scss',
  imports: [CommonModule, FormatDatePipe, IconsModule, KebabCasePipe, RouterLink],
})
export class UpcomingEventBannerComponent {
  @Input({ required: true }) public nextEvent!: Event;

  @Output() public clearBanner = new EventEmitter<void>();
}
