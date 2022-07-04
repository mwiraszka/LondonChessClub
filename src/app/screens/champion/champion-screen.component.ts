import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';

@Component({
  selector: 'lcc-champion-screen',
  templateUrl: './champion-screen.component.html',
  styleUrls: ['./champion-screen.component.scss'],
})
export class ChampionScreenComponent {
  NavPathTypes = NavPathTypes;

  constructor(private router: Router) {}

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }
}
