import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Link, NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-champion-screen',
  templateUrl: './champion-screen.component.html',
  styleUrls: ['./champion-screen.component.scss'],
})
export class ChampionScreenComponent {
  NavPathTypes = NavPathTypes;

  links: Link[] = [
    {
      path: 'http://londonchessclub.ca/?p=78',
      text: 'Past London Chess Champions (1967-2019)',
    },
    {
      path: 'http://londonchessclub.ca/?p=79',
      text: 'Past London Junior Chess Champions (1996-2011)',
    },
    {
      path: 'http://londonchessclub.ca/?p=75',
      text: 'Past London Active Chess Champions (1994-2019)',
    },
    {
      path: 'http://londonchessclub.ca/?p=72',
      text: 'Past London Speed Chess Champions (1993-2019)',
    },
  ];

  constructor(private router: Router) {}

  onNavigate(path: NavPathTypes) {
    this.router.navigate([path]);
  }
}
