import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import IconsModule from '@app/icons';

@Component({
  selector: 'lcc-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  imports: [CommonModule, IconsModule],
})
export class PageHeaderComponent {
  @Input() public hasUnsavedChanges: boolean | null = null;
  @Input() public icon: string | null = null;
  @Input() public title: string | null = null;
}

