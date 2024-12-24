import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { AppActions } from '@app/store/app';
import { EventsSelectors } from '@app/store/events';
import { NavPathTypes } from '@app/types';
import { kebabize } from '@app/utils';

@Component({
  selector: 'lcc-upcoming-event-banner',
  templateUrl: './upcoming-event-banner.component.html',
  styleUrl: './upcoming-event-banner.component.scss',
  imports: [CommonModule, FormatDatePipe, IconsModule, RouterLink],
})
export class UpcomingEventBannerComponent {
  public readonly NavPathTypes = NavPathTypes;
  public readonly kebabize = kebabize;

  public readonly nextEvent$ = this.store.select(EventsSelectors.selectNextEvent);

  constructor(private readonly store: Store) {}

  public onClearBanner(): void {
    this.store.dispatch(AppActions.upcomingEventBannerCleared());
  }
}
