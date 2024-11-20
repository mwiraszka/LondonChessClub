import { Component } from '@angular/core';

import { NavPathTypes } from '@app/types';
import { kebabize } from '@app/utils';

import { UpcomingEventBannerFacade } from './upcoming-event-banner.facade';

@Component({
  selector: 'lcc-upcoming-event-banner',
  templateUrl: './upcoming-event-banner.component.html',
  styleUrls: ['./upcoming-event-banner.component.scss'],
  providers: [UpcomingEventBannerFacade],
})
export class UpcomingEventBannerComponent {
  readonly kebabize = kebabize;
  readonly NavPathTypes = NavPathTypes;

  constructor(public facade: UpcomingEventBannerFacade) {}
}
