import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  NavPathTypes = NavPathTypes;

  constructor(private router: Router) {}

  onNavigate(path: NavPathTypes): void {
    this.router.navigate([path]);
  }
}
