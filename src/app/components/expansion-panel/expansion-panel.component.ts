/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'lcc-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
})
export class ExpansionPanelComponent {
  @Input() headerTemplate!: TemplateRef<any>;
  @Input() contentTemplate!: TemplateRef<any>;

  isOpen = false;
}
