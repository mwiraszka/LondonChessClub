import { UntilDestroy } from '@ngneat/until-destroy';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ToggleSwitchComponent } from '@app/components/toggle-switch/toggle-switch.component';

@UntilDestroy()
@Component({
  selector: 'lcc-schedule-toolbar',
  template: `
    <lcc-toggle-switch
      iconWhenOff="splitscreen"
      iconWhenOn="grid_view"
      [switchedOn]="scheduleView === 'calendar'"
      tooltipWhenOff="View as calendar"
      tooltipWhenOn="View as list"
      (toggle)="toggleScheduleView.emit()">
    </lcc-toggle-switch>

    <button
      class="today-button lcc-secondary-button"
      [disabled]="!todayScrollPoint"
      (click)="onToday()">
      today
    </button>
  `,
  styles: `
    :host {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 8px 16px;
      background-color: var(--lcc-color--dataToolbar-background);
      border-radius: var(--lcc-borderRadius--small);
      box-shadow: 0 2px 4px 0 var(--lcc-color--table-boxShadow);

      ::ng-deep lcc-toggle-switch {
        mat-icon {
          color: white;
          margin-right: 4px;
        }
      }

      .today-button {
        padding: 4px 8px;
        font-size: 13px;
        border-color: var(--lcc-color--dataToolbar-buttonBorder);
        color: var(--lcc-color--dataToolbar-text);

        &:disabled {
          opacity: 0.8;
          cursor: default;
        }
      }
    }
  `,
  imports: [CommonModule, MatIconModule, ToggleSwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleToolbarComponent {
  @Input({ required: true }) scheduleView!: 'list' | 'calendar';

  @Output() toggleScheduleView = new EventEmitter<void>();

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

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
}
