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
      class="page-title"
      [class.end-with-asterisk]="hasUnsavedChanges">
      {{ title }}
    </h2>
  `,
  styleUrl: './page-header.component.scss',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input({ required: true }) public title!: string;

  @Input() public hasUnsavedChanges: boolean | null = null;
  @Input() public icon: string | null = null;
}
