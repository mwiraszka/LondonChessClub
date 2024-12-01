import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { IconsModule } from '@app/icons';

@Component({
  standalone: true,
  selector: 'lcc-screen-header',
  templateUrl: './screen-header.component.html',
  styleUrls: ['./screen-header.component.scss'],
  imports: [CommonModule, IconsModule],
})
export class ScreenHeaderComponent {
  @Input() hasUnsavedChanges?: boolean;
  @Input() icon?: string | null;
  @Input() title?: string | null;
}
