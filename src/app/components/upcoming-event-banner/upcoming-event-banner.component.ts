import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { EventsSelectors } from '@app/store/events';
import { UserSettingsActions } from '@app/store/user-settings';
import { NavPathTypes } from '@app/types';
import { kebabize } from '@app/utils';

@Component({
  selector: 'lcc-upcoming-event-banner',
  templateUrl: './upcoming-event-banner.component.html',
  styleUrls: ['./upcoming-event-banner.component.scss'],
  imports: [CommonModule, FormatDatePipe, IconsModule, RouterLink],
})
export class UpcomingEventBannerComponent {
  public readonly NavPathTypes = NavPathTypes;
  public readonly kebabize = kebabize;

  public readonly nextEvent$ = this.store.select(EventsSelectors.selectNextEvent);

  constructor(private readonly store: Store) {}

  public onClearBanner(): void {
    this.store.dispatch(UserSettingsActions.upcomingEventBannerCleared());
  }
}
