import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lcc-expansion-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      class="expansion-panel"
      [class.expanded]="expanded">
      <div
        class="expansion-header"
        (click)="expanded = !expanded">
        <div class="header-text">
          <ng-content select="[header]"></ng-content>
          @if (heading) {
            <h4>{{ heading }}</h4>
          }
        </div>
        <mat-icon>{{ expanded ? 'expand_less' : 'expand_more' }}</mat-icon>
      </div>

      @if (expanded) {
        <div class="expansion-content">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
  styleUrl: './expansion-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent {
  @Input() expanded = false;
  @Input() heading?: string;
}
