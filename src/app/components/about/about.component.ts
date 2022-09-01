import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  NavPathTypes = NavPathTypes;

  constructor(private router: Router) {}

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }
}
