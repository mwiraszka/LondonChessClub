import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lcc-safe-mode-notice',
  template: `
    <mat-icon>check_circle_outline</mat-icon>
    <aside>
      {{ entity | titlecase }} personal details have been hidden from view. You can
      disable Safe Mode from the User Settings menu.
    </aside>
  `,
  styleUrl: './safe-mode-notice.component.scss',
  imports: [MatIconModule, TitleCasePipe],
})
export class SafeModeNoticeComponent {
  @Input({ required: true }) entity!: string;
}
