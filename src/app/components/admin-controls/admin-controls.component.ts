import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lcc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrls: ['./admin-controls.component.scss'],
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
