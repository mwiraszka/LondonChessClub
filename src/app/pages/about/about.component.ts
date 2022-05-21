import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavPaths } from '@app/core/nav';

@Component({
  selector: 'lcc-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  NavPaths = NavPaths;

  constructor(private router: Router) {}

  onNavigate(path: NavPaths) {
    this.router.navigate([path]);
  }
}
