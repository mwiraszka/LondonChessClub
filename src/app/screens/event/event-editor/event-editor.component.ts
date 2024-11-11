import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { MetaAndTitleService } from '@app/services';

import { EventEditorFacade } from './event-editor.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss'],
  providers: [EventEditorFacade],
})
export class EventEditorComponent implements OnInit {
  constructor(
    public facade: EventEditorFacade,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.facade.selectedEventTitle$, this.facade.controlMode$])
      .pipe(untilDestroyed(this))
      .subscribe(([eventTitle, controlMode]) => {
        const screenTitle =
          controlMode === 'edit' && eventTitle ? `Edit ${eventTitle}` : 'Create an event';
        this.metaAndTitleService.updateTitle(screenTitle);
        this.metaAndTitleService.updateDescription(
          `${screenTitle} for the London Chess Club.`,
        );
      });
  }
}
