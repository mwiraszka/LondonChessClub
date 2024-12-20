import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { EventFormComponent } from '@app/components/event-form/event-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { MetaAndTitleService } from '@app/services';
import { EventsSelectors } from '@app/store/events';
import { Link, NavPathTypes } from '@app/types';

@UntilDestroy()
@Component({
  selector: 'lcc-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss'],
  imports: [CommonModule, EventFormComponent, LinkListComponent, ScreenHeaderComponent],
})
export class EventEditorComponent implements OnInit {
  public readonly selectEventEditorViewModel$ = this.store.select(
    EventsSelectors.selectEventEditorViewModel,
  );

  public links: Link[] = [
    {
      icon: 'calendar',
      path: NavPathTypes.NEWS,
      text: 'See all events',
    },
    {
      icon: 'home',
      path: NavPathTypes.HOME,
      text: 'Return home',
    },
  ];

  constructor(
    private readonly store: Store,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    this.selectEventEditorViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ eventTitle, controlMode }) => {
        const screenTitle =
          controlMode === 'edit' && eventTitle ? `Edit ${eventTitle}` : 'Create an event';
        this.metaAndTitleService.updateTitle(screenTitle);
        this.metaAndTitleService.updateDescription(
          `${screenTitle} for the London Chess Club.`,
        );
      });
  }
}
