import { Component } from '@angular/core';

import { NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  NavPathTypes = NavPathTypes;
}
