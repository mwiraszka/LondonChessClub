import { Component, OnInit } from '@angular/core';

import { ScheduleScreenFacade } from './schedule-screen.facade';

@Component({
  selector: 'schedule-screen',
  templateUrl: './schedule-screen.component.html',
  styleUrls: ['./schedule-screen.component.scss'],
  providers: [ScheduleScreenFacade],
})
export class ScheduleScreenComponent implements OnInit {
  constructor(public facade: ScheduleScreenFacade) {}

  ngOnInit(): void {
    this.facade.nextEventId$.subscribe(eventId => {
      if (eventId) {
        setTimeout(() => this.scrollToNextEvent(eventId), 300);
      }
    });
  }

  scrollToNextEvent(eventId: string): void {
    const nextEvent = document.getElementById(eventId);
    if (nextEvent) {
      nextEvent.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }
}
