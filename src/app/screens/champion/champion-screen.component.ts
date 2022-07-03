import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavPathTypes } from '@app/core/nav';
import { ClarityIcons, crownIcon } from '@cds/core/icon';

@Component({
  selector: 'lcc-champion-screen',
  templateUrl: './champion-screen.component.html',
  styleUrls: ['./champion-screen.component.scss'],
})
export class ChampionScreenComponent implements OnInit {
  NavPathTypes = NavPathTypes;

  constructor(private router: Router) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(crownIcon);
  }

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }
}
