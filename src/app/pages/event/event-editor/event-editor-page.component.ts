import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { EventFormComponent } from '@app/components/event-form/event-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { EventsSelectors } from '@app/store/events';

@UntilDestroy()
@Component({
  selector: 'lcc-event-editor-page',
  templateUrl: './event-editor-page.component.html',
  imports: [CommonModule, EventFormComponent, LinkListComponent, PageHeaderComponent],
})
export class EventEditorPageComponent implements OnInit {
  public readonly eventEditorPageViewModel$ = this.store.select(
    EventsSelectors.selectEventEditorPageViewModel,
  );
  public readonly links: InternalLink[] = [
    {
      text: 'See all events',
      internalPath: 'news',
      icon: 'calendar',
    },
    {
      text: 'Return home',
      internalPath: '',
      icon: 'home',
    },
  ];

  constructor(
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.eventEditorPageViewModel$
      .pipe(untilDestroyed(this))
      .subscribe(({ eventTitle, controlMode }) => {
        const pageTitle =
          controlMode === 'edit' && eventTitle ? `Edit ${eventTitle}` : 'Create an event';
        this.metaAndTitleService.updateTitle(pageTitle);
        this.metaAndTitleService.updateDescription(
          `${pageTitle} for the London Chess Club.`,
        );
      });
  }
}
