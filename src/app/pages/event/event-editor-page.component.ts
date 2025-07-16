import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventFormComponent } from '@app/components/event-form/event-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import type { EditorPage, Event, EventFormData, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { EventsSelectors } from '@app/store/events';

@UntilDestroy()
@Component({
  selector: 'lcc-event-editor-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [title]="vm.pageTitle">
      </lcc-page-header>
      <lcc-event-form
        [formData]="vm.formData"
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [originalEvent]="vm.originalEvent">
      </lcc-event-form>
      <lcc-link-list [links]="[schedulePageLink]"></lcc-link-list>
    }
  `,
  imports: [CommonModule, EventFormComponent, LinkListComponent, PageHeaderComponent],
})
export class EventEditorPageComponent implements EditorPage, OnInit {
  public readonly entity = 'event';
  public readonly schedulePageLink: InternalLink = {
    text: 'See all events',
    internalPath: 'schedule',
    icon: 'calendar',
  };
  public viewModel$?: Observable<{
    formData: EventFormData;
    hasUnsavedChanges: boolean;
    originalEvent: Event | null;
    pageTitle: string;
  }>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.viewModel$ = this.activatedRoute.params.pipe(
      untilDestroyed(this),
      map(params => (params['event_id'] ?? null) as string | null),
      switchMap(eventId =>
        combineLatest([
          this.store.select(EventsSelectors.selectEventById(eventId)),
          this.store.select(EventsSelectors.selectEventFormDataById(eventId)),
          this.store.select(EventsSelectors.selectHasUnsavedChanges(eventId)),
        ]),
      ),
      map(([originalEvent, formData, hasUnsavedChanges]) => ({
        originalEvent,
        formData,
        hasUnsavedChanges,
        pageTitle: originalEvent ? `Edit ${originalEvent.title}` : 'Add an event',
      })),
      tap(viewModel => {
        this.metaAndTitleService.updateTitle(viewModel.pageTitle);
        this.metaAndTitleService.updateDescription(
          `${viewModel.pageTitle} for the London Chess Club.`,
        );
      }),
    );
  }
}
