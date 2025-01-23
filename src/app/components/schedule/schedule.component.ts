import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminControlsDirective } from '@app/components/admin-controls/admin-controls.directive';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import IconsModule from '@app/icons';
import type {
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  Event,
  InternalLink,
} from '@app/models';
import { FormatDatePipe, KebabCasePipe } from '@app/pipes';
import { DialogService } from '@app/services';
import { EventsActions, EventsSelectors } from '@app/store/events';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  imports: [
    AdminControlsDirective,
    CommonModule,
    FormatDatePipe,
    IconsModule,
    KebabCasePipe,
    LinkListComponent,
    RouterLink,
  ],
})
export class ScheduleComponent implements OnInit {
  @Input() public allowTogglePastEvents = true;
  @Input() public includeDetails = true;
  @Input() public upcomingEventLimit?: number;

  public readonly addEventLink: InternalLink = {
    text: 'Add an event',
    internalPath: ['event', 'add'],
    icon: 'plus-circle',
  };
  public readonly scheduleViewModel$ = this.store.select(
    EventsSelectors.selectScheduleViewModel,
  );

  constructor(
    private readonly dialogService: DialogService<
      BasicDialogComponent,
      BasicDialogResult
    >,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  public fetchEvents(): void {
    this.store.dispatch(EventsActions.fetchEventsRequested());
  }

  public getAdminControlsConfig(event: Event): AdminControlsConfig {
    return {
      buttonSize: 34,
      deleteCb: () => this.onDeleteEvent(event),
      editPath: ['event', 'edit', event.id!],
      itemName: event.title,
    };
  }

  public async onDeleteEvent(event: Event): Promise<void> {
    const dialog: Dialog = {
      title: 'Delete event',
      body: `Delete ${event.title}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    if (result === 'confirm') {
      this.store.dispatch(EventsActions.deleteEventRequested({ event }));
    }
  }

  public onTogglePastEvents(): void {
    this.store.dispatch(EventsActions.pastEventsToggled());

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
