import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClarityIcons, pencilIcon, trashIcon } from '@cds/core/icon';

@Component({
  selector: 'lcc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrls: ['./admin-controls.component.scss'],
})
export class AdminControlsComponent implements OnInit {
  @Input() itemName: string = '';

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  ngOnInit(): void {
    ClarityIcons.addIcons(pencilIcon, trashIcon);
  }
}
