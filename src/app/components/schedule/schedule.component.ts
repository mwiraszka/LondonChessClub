import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import IconsModule from '@app/icons';
import { FormatDatePipe, KebabCasePipe } from '@app/pipes';
import { DialogService } from '@app/services';
import { EventsActions, EventsSelectors } from '@app/store/events';
import type { BasicDialogResult, Dialog, Event, InternalLink } from '@app/types';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  imports: [
    AdminControlsComponent,
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

  public async onDeleteEvent(event: Event): Promise<void> {
    const dialog: Dialog = {
      title: 'Confirm event deletion',
      body: `Update ${event.title}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open({
      componentType: BasicDialogComponent,
      inputs: { dialog },
    });

    if (result !== 'confirm') {
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
