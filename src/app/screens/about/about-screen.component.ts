import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';

@Component({
  selector: 'lcc-about-screen',
  templateUrl: './about-screen.component.html',
  styleUrls: ['./about-screen.component.scss'],
})
export class AboutScreenComponent {
  NavPathTypes = NavPathTypes;

  constructor(private router: Router) {}

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }
}
