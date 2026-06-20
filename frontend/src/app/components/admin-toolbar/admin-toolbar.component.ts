import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { AdminButton, ExternalLink, InternalLink } from '@app/models';

@Component({
  selector: 'lcc-admin-toolbar',
  template: `
    <mat-icon class="admin-icon">admin_panel_settings</mat-icon>
    <div class="controls-container">
      @if (adminLinks) {
        <lcc-link-list [links]="adminLinks"></lcc-link-list>
      }
      @if (adminButtons) {
        <div class="admin-buttons">
          @for (button of adminButtons; track button.id) {
            <button
              [id]="button.id"
              class="admin-button lcc-secondary-button"
              type="button"
              [tooltip]="button.tooltip"
              (click)="button.action()">
              <mat-icon class="button-icon">{{ button.icon }}</mat-icon>
            </button>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './admin-toolbar.component.scss',
  imports: [LinkListComponent, MatIconModule, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminToolbarComponent {
  @Input() adminButtons?: AdminButton[];
  @Input() adminLinks?: Array<InternalLink | ExternalLink>;
}
