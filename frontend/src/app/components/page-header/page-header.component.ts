import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lcc-page-header',
  template: `
    @if (icon) {
      <mat-icon
        class="page-header-icon"
        [class.admin-page]="icon === 'admin_panel_settings'">
        {{ icon }}
      </mat-icon>
    }
    <h2
      class="page-heading"
      [class.end-with-asterisk]="hasUnsavedChanges">
      {{ heading }}
    </h2>
  `,
  styleUrl: './page-header.component.scss',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input({ required: true }) public heading!: string;

  @Input() public hasUnsavedChanges: boolean | null = null;
  @Input() public icon: string | null = null;
}
