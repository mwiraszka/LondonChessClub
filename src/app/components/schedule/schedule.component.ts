import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import type {
  AdminControlsConfig,
  BasicDialogResult,
  Dialog,
  Event,
  InternalLink,
} from '@app/models';
import { FormatDatePipe, KebabCasePipe } from '@app/pipes';
import { DialogService } from '@app/services';
import { EventsActions } from '@app/store/events';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  imports: [
    AdminControlsDirective,
    CommonModule,
    FormatDatePipe,
    KebabCasePipe,
    LinkListComponent,
    MatIconModule,
    RouterLink,
  ],
})
export class ScheduleComponent implements OnInit {
  @Input({ required: true }) public allEvents!: Event[];
  @Input({ required: true }) public isAdmin!: boolean;
  @Input({ required: true }) public nextEvent!: Event | null;
  @Input({ required: true }) public showPastEvents!: boolean;
  @Input({ required: true }) public upcomingEvents!: Event[];

  @Input() public allowTogglePastEvents = true;
  @Input() public includeDetails = true;
  @Input() public upcomingEventLimit?: number;

  public readonly addEventLink: InternalLink = {
    text: 'Add an event',
    internalPath: ['event', 'add'],
    icon: 'add_circle_outline',
  };

  constructor(
    private readonly dialogService: DialogService,
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
      title: 'Confirm',
      body: `Delete ${event.title}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open<BasicDialogComponent, BasicDialogResult>(
      {
        componentType: BasicDialogComponent,
        inputs: { dialog },
        isModal: true,
      },
    );

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
