import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import IconsModule from '@app/icons';
import { FormatDatePipe, KebabCasePipe } from '@app/pipes';
import { AppActions } from '@app/store/app';
import { EventsSelectors } from '@app/store/events';

@Component({
  selector: 'lcc-upcoming-event-banner',
  templateUrl: './upcoming-event-banner.component.html',
  styleUrl: './upcoming-event-banner.component.scss',
  imports: [CommonModule, FormatDatePipe, IconsModule, KebabCasePipe, RouterLink],
})
export class UpcomingEventBannerComponent {
  public readonly nextEvent$ = this.store.select(EventsSelectors.selectNextEvent);

  constructor(private readonly store: Store) {}

  public onClearBanner(): void {
    this.store.dispatch(AppActions.upcomingEventBannerCleared());
  }
}
