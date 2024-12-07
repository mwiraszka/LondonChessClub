import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

import { ScheduleScreenFacade } from './schedule-screen.facade';

@Component({
  selector: 'schedule-screen',
  templateUrl: './schedule-screen.component.html',
  styleUrls: ['./schedule-screen.component.scss'],
  providers: [ScheduleScreenFacade],
  imports: [CommonModule, ScheduleComponent, ScreenHeaderComponent],
})
export class ScheduleScreenComponent implements OnInit {
  constructor(
    public facade: ScheduleScreenFacade,
    private metaAndTitleService: MetaAndTitleService,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Schedule');
    this.metaAndTitleService.updateDescription(
      'Scheduled events at the London Chess Club',
    );

    this.facade.upcomingEvents$.subscribe(upcomingEvents => {
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
