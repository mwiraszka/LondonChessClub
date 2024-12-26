import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import { RouterLinkPipe } from '@app/pipes';
import type { InternalPath } from '@app/types';

@Component({
  selector: 'lcc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrl: './admin-controls.component.scss',
  imports: [CommonModule, IconsModule, RouterLink, RouterLinkPipe, TooltipDirective],
})
export class AdminControlsComponent {
  @Input() height = 28;
  @Input() itemName = '';
  @Input() editPath?: InternalPath;

  @Output() delete = new EventEmitter<void>();

  public onEdit(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  public onDelete(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.delete.emit();
  }
}
