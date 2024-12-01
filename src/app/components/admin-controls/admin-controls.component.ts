import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import { IconsModule } from '@app/icons';

@Component({
  standalone: true,
  selector: 'lcc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrls: ['./admin-controls.component.scss'],
  imports: [CommonModule, IconsModule, RouterLink, TooltipDirective],
})
export class AdminControlsComponent {
  @Input() height = 28;
  @Input() itemName = '';
  @Input() editPath = '';

  @Output() delete = new EventEmitter<void>();

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.delete.emit();
  }
}
