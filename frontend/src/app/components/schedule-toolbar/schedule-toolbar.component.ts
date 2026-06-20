import { UntilDestroy } from '@ngneat/until-destroy';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { BasicDialogResult, Dialog, Event } from '@app/models';
import { DialogService } from '@app/services';
import { exportEventsToIcal } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-schedule-toolbar',
  template: `
    <button
      class="today-button lcc-secondary-button"
      [disabled]="!todayScrollPoint"
      tooltip="Scroll to today"
      (click)="onToday()">
      today
    </button>

    <lcc-toggle-switch
      iconWhenOff="splitscreen"
      iconWhenOn="grid_view"
      [switchedOn]="scheduleView === 'calendar'"
      tooltipWhenOff="View as calendar"
      tooltipWhenOn="View as list"
      (toggle)="toggleScheduleView.emit()">
    </lcc-toggle-switch>

    <button
      class="export-to-ical-button lcc-secondary-button"
      [disabled]="!filteredEvents.length"
      (click)="onExportToIcal()"
      tooltip="Export events to iCalendar">
      <mat-icon>event_available</mat-icon>
    </button>
  `,
  styleUrl: './schedule-toolbar.component.scss',
  imports: [MatIconModule, ToggleSwitchComponent, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleToolbarComponent {
  @Input({ required: true }) filteredEvents!: Event[];
  @Input({ required: true }) scheduleView!: 'list' | 'calendar';
  @Input({ required: true }) totalCount!: number;

  @Output() toggleScheduleView = new EventEmitter<void>();

  constructor(
    public readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dialogService: DialogService,
  ) {}

  public get todayScrollPoint(): Element | null {
    return document.querySelector('.schedule-view.active .today-scroll-point');
  }

  public onToday(): void {
    if (this.todayScrollPoint) {
      this.todayScrollPoint.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  public async onExportToIcal(): Promise<void> {
    const body1 =
      this.filteredEvents.length === this.totalCount
        ? `All ${this.totalCount}`
        : `The ${this.filteredEvents.length} currently visible`;
    const body2 = `${this.filteredEvents.length === 1 ? 'event' : 'events'}`;
    const body3 =
      'will be exported to an iCalendar file, which can then be imported into Google Calendar, Apple Calendar or Microsoft Outlook.';

    const dialog: Dialog = {
      title: 'Confirm',
      body: `${body1} ${body2} ${body3}`,
      confirmButtonText: 'Export',
      confirmButtonType: 'primary',
    };

    const dialogResult = await this.dialogService.open<
      BasicDialogComponent,
      BasicDialogResult
    >({
      componentType: BasicDialogComponent,
      inputs: { dialog },
      isModal: false,
    });

    if (dialogResult !== 'confirm') {
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `london_chess_club_events_${timestamp}.ics`;

    exportEventsToIcal(this.filteredEvents, filename);
  }
}
