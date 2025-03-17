import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import { MetaAndTitleService } from '@app/services';
import { EventsSelectors } from '@app/store/events';

@UntilDestroy()
@Component({
  selector: 'schedule-page',
  template: `
    <lcc-page-header
      title="Schedule"
      icon="calendar">
    </lcc-page-header>
    <lcc-schedule></lcc-schedule>
  `,
  imports: [CommonModule, ScheduleComponent, PageHeaderComponent],
})
export class SchedulePageComponent implements OnInit {
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
