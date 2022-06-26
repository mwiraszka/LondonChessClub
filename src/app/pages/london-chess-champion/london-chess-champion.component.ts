import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';
import { ClarityIcons, crownIcon } from '@cds/core/icon';

@Component({
  selector: 'lcc-london-chess-champion',
  templateUrl: './london-chess-champion.component.html',
  styleUrls: ['./london-chess-champion.component.scss'],
})
export class LondonChessChampionComponent implements OnInit {
  NavPathTypes = NavPathTypes;

  constructor(private router: Router) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(crownIcon);
  }

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }
}
