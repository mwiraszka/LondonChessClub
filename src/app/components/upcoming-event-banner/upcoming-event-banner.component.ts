import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { NavPathTypes } from '@app/types';
import { kebabize } from '@app/utils';

import { UpcomingEventBannerFacade } from './upcoming-event-banner.facade';

@Component({
  selector: 'lcc-upcoming-event-banner',
  templateUrl: './upcoming-event-banner.component.html',
  styleUrls: ['./upcoming-event-banner.component.scss'],
  providers: [UpcomingEventBannerFacade],
  imports: [CommonModule, FormatDatePipe, IconsModule, RouterLink],
})
export class UpcomingEventBannerComponent {
  readonly kebabize = kebabize;
  readonly NavPathTypes = NavPathTypes;

  constructor(public facade: UpcomingEventBannerFacade) {}
}
