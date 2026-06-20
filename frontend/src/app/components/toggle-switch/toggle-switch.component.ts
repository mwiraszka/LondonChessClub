import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TooltipDirective } from '@app/directives/tooltip.directive';
import { generateUuid } from '@app/utils/common/generate-uuid.util';

@Component({
  selector: 'lcc-toggle-switch',
  template: `
    @if (switchedOn && iconWhenOn) {
      <mat-icon>{{ iconWhenOn }}</mat-icon>
    } @else if (!switchedOn && iconWhenOff) {
      <mat-icon
        [class.warning]="warningWhenOff"
        [tooltip]="iconTooltipWhenOff">
        {{ iconWhenOff }}
      </mat-icon>
    }

    <label
      #switchTooltip
      class="toggle-switch"
      [for]="uniqueId"
      [tooltip]="switchedOn ? tooltipWhenOn : tooltipWhenOff">
      <input
        type="checkbox"
        [id]="uniqueId"
        [checked]="switchedOn"
        (change)="onToggleChange()" />
      <div
        class="slider round"
        [class.warning]="!switchedOn && warningWhenOff">
      </div>
    </label>
  `,
  styleUrl: './toggle-switch.component.scss',
  imports: [MatIconModule, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent implements OnInit {
  @Input({ required: true }) public switchedOn = false;

  @Input() public iconTooltipWhenOff: string | TemplateRef<unknown> | null = null;
  @Input() public iconWhenOff?: string;
  @Input() public iconWhenOn?: string;
  @Input() public tooltipWhenOff: string | TemplateRef<unknown> | null = null;
  @Input() public tooltipWhenOn: string | TemplateRef<unknown> | null = null;
  @Input() public warningWhenOff = false;

  @Output() public toggle = new EventEmitter<boolean>();

  @ViewChild('switchTooltip', { read: TooltipDirective, static: false })
  private tooltipDirective?: TooltipDirective;

  public uniqueId!: string;

  public ngOnInit(): void {
    this.uniqueId = generateUuid().slice(-8);
  }

  public onToggleChange(): void {
    this.toggle.emit();

    if (this.tooltipDirective) {
      this.tooltipDirective.detach();
      setTimeout(() => this.tooltipDirective?.attach());
    }
  }
}
