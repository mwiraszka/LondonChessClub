import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import IconsModule from '@app/icons';

@Component({
  selector: 'lcc-screen-header',
  templateUrl: './screen-header.component.html',
  styleUrl: './screen-header.component.scss',
  imports: [CommonModule, IconsModule],
})
export class ScreenHeaderComponent {
  @Input() public hasUnsavedChanges: boolean | null = null;
  @Input() public icon: string | null = null;
  @Input() public title: string | null = null;
}
