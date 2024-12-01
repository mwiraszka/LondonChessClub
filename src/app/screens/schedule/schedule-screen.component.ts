import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

import { ScheduleComponent } from '@app/components/schedule/schedule.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

import { ScheduleScreenFacade } from './schedule-screen.facade';

@Component({
  standalone: true,
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
      "What's in store at the London Chess Club",
    );

    this.facade.nextEventId$.subscribe(eventId => {
      if (eventId) {
        setTimeout(() => this.scrollToNextEvent(eventId), 150);
      }
    });
  }

  scrollToNextEvent(eventId: string): void {
    const nextEvent = this._document.getElementById(eventId);
    if (nextEvent) {
      nextEvent.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
