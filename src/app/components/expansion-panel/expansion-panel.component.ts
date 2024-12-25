import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

import { IconsModule } from '@app/icons';

@Component({
  selector: 'lcc-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
  imports: [CommonModule, IconsModule, NgTemplateOutlet],
})
export class ExpansionPanelComponent {
  @Input({ required: true }) headerTemplate!: TemplateRef<unknown>;
  @Input({ required: true }) contentTemplate!: TemplateRef<unknown>;
  @Input() isOpen = false;
}
