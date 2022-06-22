import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';

@Component({
  selector: 'lcc-london-chess-champion',
  templateUrl: './london-chess-champion.component.html',
  styleUrls: ['./london-chess-champion.component.scss'],
})
export class LondonChessChampionComponent {
  NavPathTypes = NavPathTypes;

  constructor(private router: Router) {}

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }
}
