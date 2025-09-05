import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import {
  AdminControlsConfig,
  BasicDialogResult,
  DataPaginationOptions,
  Dialog,
  Event,
} from '@app/models';
import { FormatDatePipe, HighlightPipe, KebabCasePipe } from '@app/pipes';
import { DialogService } from '@app/services';

@Component({
  selector: 'lcc-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.scss',
  imports: [
    AdminControlsDirective,
    CommonModule,
    FormatDatePipe,
    HighlightPipe,
    KebabCasePipe,
    MatIconModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleListComponent {
  @Input({ required: true }) public events!: Event[];
  @Input({ required: true }) public isAdmin!: boolean;
  @Input({ required: true }) public nextEvent!: Event | null;

  @Input() public options?: DataPaginationOptions<Event>;
  @Input() public showModificationInfo?: boolean;

  @Output() public requestDeleteEvent = new EventEmitter<Event>();

  constructor(private readonly dialogService: DialogService) {}

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
      this.requestDeleteEvent.emit(event);
    }
  }
}
