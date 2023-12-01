import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lcc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrls: ['./admin-controls.component.scss'],
})
export class AdminControlsComponent {
  @Input() height = 28;
  @Input() itemName = '';

  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit();
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit();
  }
}
