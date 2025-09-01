import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventFormComponent } from '@app/components/event-form/event-form.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { EditorPage, Event, EventFormData, InternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';
import { EventsActions, EventsSelectors } from '@app/store/events';

@UntilDestroy()
@Component({
  selector: 'lcc-event-editor-page',
  template: `
    @if (viewModel$ | async; as vm) {
      <lcc-page-header
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        icon="admin_panel_settings"
        [title]="vm.pageTitle">
      </lcc-page-header>

      <lcc-event-form
        [formData]="vm.formData"
        [hasUnsavedChanges]="vm.hasUnsavedChanges"
        [originalEvent]="vm.originalEvent"
        (cancel)="onCancel()"
        (change)="onChange($event.eventId, $event.formData)"
        (requestAddEvent)="onRequestAddEvent()"
        (requestUpdateEvent)="onRequestUpdateEvent($event)"
        (restore)="onRestore($event)">
      </lcc-event-form>

      <lcc-link-list [links]="[schedulePageLink]"></lcc-link-list>
    }
  `,
  imports: [CommonModule, EventFormComponent, LinkListComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public onCancel(): void {
    this.store.dispatch(EventsActions.cancelSelected());
  }

  public onChange(eventId: string | null, formData: Partial<EventFormData>): void {
    this.store.dispatch(EventsActions.formDataChanged({ eventId, formData }));
  }

  public onRequestAddEvent(): void {
    this.store.dispatch(EventsActions.addEventRequested());
  }

  public onRequestUpdateEvent(eventId: string): void {
    this.store.dispatch(EventsActions.updateEventRequested({ eventId }));
  }

  public onRestore(eventId: string | null): void {
    this.store.dispatch(EventsActions.formDataRestored({ eventId }));
  }
}
