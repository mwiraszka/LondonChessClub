import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';
import { EventsSelectors } from '@app/store/events';

@UntilDestroy()
@Component({
  selector: 'schedule-screen',
  template: `
    <lcc-screen-header
      title="Schedule"
      icon="calendar">
    </lcc-screen-header>
    <lcc-schedule></lcc-schedule>
  `,
  imports: [CommonModule, ScheduleComponent, ScreenHeaderComponent],
})
export class ScheduleScreenComponent implements OnInit {
  public readonly upcomingEvents$ = this.store.select(
    EventsSelectors.selectUpcomingEvents,
  );

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Schedule');
    this.metaAndTitleService.updateDescription(
      'Scheduled events at the London Chess Club',
    );

    this.upcomingEvents$.pipe(untilDestroyed(this)).subscribe(upcomingEvents => {
      if (!upcomingEvents?.length || !upcomingEvents[0]?.id) {
        return;
      }

      setTimeout(() => {
        const nextEvent = this._document.getElementById(upcomingEvents[0].id!);
        if (nextEvent) {
          nextEvent.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }, 150);
    });
  }
}
