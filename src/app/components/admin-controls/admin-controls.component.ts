import { ClarityIcons, pencilIcon, trashIcon } from '@cds/core/icon';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lcc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrls: ['./admin-controls.component.scss'],
})
export class AdminControlsComponent implements OnInit {
  @Input() itemName = '';

  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  ngOnInit(): void {
    ClarityIcons.addIcons(pencilIcon, trashIcon);
  }
}
