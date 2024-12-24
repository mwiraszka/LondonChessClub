import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminControlsComponent } from '@app/components/admin-controls/admin-controls.component';
import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { ModalComponent } from '@app/components/modal/modal.component';
import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { DialogService } from '@app/services';
import { EventsActions, EventsSelectors } from '@app/store/events';
import {
  type Event,
  type Link,
  type Modal,
  type ModalResult,
  NavPathTypes,
} from '@app/types';
import { kebabize } from '@app/utils';

@Component({
  selector: 'lcc-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  imports: [
    AdminControlsComponent,
    CommonModule,
    FormatDatePipe,
    IconsModule,
    LinkListComponent,
    RouterLink,
  ],
})
export class ScheduleComponent implements OnInit {
  public readonly NavPathTypes = NavPathTypes;
  public readonly kebabize = kebabize;

  @Input() public allowTogglePastEvents = true;
  @Input() public includeDetails = true;
  @Input() public upcomingEventLimit?: number;

  public readonly addEventLink: Link = {
    path: NavPathTypes.EVENT + '/' + NavPathTypes.ADD,
    text: 'Add an event',
    icon: 'plus-circle',
  };
  public readonly scheduleViewModel$ = this.store.select(
    EventsSelectors.selectScheduleViewModel,
  );

  constructor(
    private readonly dialogService: DialogService<ModalComponent, ModalResult>,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  public fetchEvents(): void {
    this.store.dispatch(EventsActions.fetchEventsRequested());
  }

  public async onDeleteEvent(event: Event): Promise<void> {
    const modal: Modal = {
      title: 'Confirm event deletion',
      body: `Update ${event.title}?`,
      confirmButtonText: 'Delete',
      confirmButtonType: 'warning',
    };

    const result = await this.dialogService.open({
      componentType: ModalComponent,
      inputs: { modal },
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
