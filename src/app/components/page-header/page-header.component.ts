import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lcc-page-header',
  template: `
    @if (icon) {
      <mat-icon>{{ icon }}</mat-icon>
    }
    <h1
      class="page-title"
      [class.end-with-asterisk]="hasUnsavedChanges">
      {{ title }}
    </h1>
  `,
  styleUrl: './page-header.component.scss',
  imports: [MatIconModule],
})
export class PageHeaderComponent {
  @Input({ required: true }) public title!: string;

  @Input() public hasUnsavedChanges: boolean | null = null;
  @Input() public icon: string | null = null;
}
