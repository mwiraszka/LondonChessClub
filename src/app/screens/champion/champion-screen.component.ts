import { Component } from '@angular/core';

import { Link, NavPathTypes } from '@app/types';

import { ChampionScreenFacade } from './champion-screen.facade';

@Component({
  selector: 'lcc-champion-screen',
  templateUrl: './champion-screen.component.html',
  styleUrls: ['./champion-screen.component.scss'],
  providers: [ChampionScreenFacade],
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

  constructor(public facade: ChampionScreenFacade) {}
}
