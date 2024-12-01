/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

import { IconsModule } from '@app/icons';

@Component({
  standalone: true,
  selector: 'lcc-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  imports: [CommonModule, IconsModule, NgTemplateOutlet],
})
export class ExpansionPanelComponent {
  @Input() headerTemplate!: TemplateRef<any>;
  @Input() contentTemplate!: TemplateRef<any>;
  @Input() isOpen = false;
}
