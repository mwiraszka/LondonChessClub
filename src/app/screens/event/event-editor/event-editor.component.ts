import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { EventFormComponent } from '@app/components/event-form/event-form.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';

import { EventEditorFacade } from './event-editor.facade';

@UntilDestroy()
@Component({
  selector: 'lcc-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss'],
  providers: [EventEditorFacade],
  imports: [CommonModule, EventFormComponent, ScreenHeaderComponent],
})
export class EventEditorComponent implements OnInit {
  constructor(
    public facade: EventEditorFacade,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    combineLatest([this.facade.setEventTitle$, this.facade.controlMode$])
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
