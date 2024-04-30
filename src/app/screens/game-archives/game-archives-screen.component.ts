import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, HostListener, OnInit, ViewChildren } from '@angular/core';

import { MetaAndTitleService } from '@app/services';

import { GameArchivesScreenFacade } from './game-archives-screen.facade';
import * as fromPgns from './pgns';

@Component({
  selector: 'lcc-game-archives-screen',
  templateUrl: './game-archives-screen.component.html',
  styleUrls: ['./game-archives-screen.component.scss'],
  providers: [GameArchivesScreenFacade],
})
export class GameArchivesScreenComponent implements OnInit {
  expansionPanels!: { label: string; pgns: string[] }[];

  @ViewChildren(CdkVirtualScrollViewport)
  cdkVirtualScrollViewport?: CdkVirtualScrollViewport;

  constructor(
    public facade: GameArchivesScreenFacade,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.cdkVirtualScrollViewport?.checkViewportSize();
  }

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Game Archives');
    this.metaAndTitleService.updateDescription(
      'A collection of games played by London Chess Club members, going all the way back to 1974.',
    );

    this.expansionPanels = [
      {
        label: '2005',
        pgns: fromPgns.pgns2005,
      },
      {
        label: '2000',
        pgns: fromPgns.pgns2000,
      },
      {
        label: '1999',
        pgns: fromPgns.pgns1999,
      },
      {
        label: '1998',
        pgns: fromPgns.pgns1998,
      },
      {
        label: '1997',
        pgns: fromPgns.pgns1997,
      },
      {
        label: '1996',
        pgns: fromPgns.pgns1996,
      },
      {
        label: '1995',
        pgns: fromPgns.pgns1995,
      },
      {
        label: '1994',
        pgns: fromPgns.pgns1994,
      },
      {
        label: '1993',
        pgns: fromPgns.pgns1993,
      },
      {
        label: '1992',
        pgns: fromPgns.pgns1992,
      },
      {
        label: '1991',
        pgns: fromPgns.pgns1991,
      },
      {
        label: '1990',
        pgns: fromPgns.pgns1990,
      },
      {
        label: '1989',
        pgns: fromPgns.pgns1989,
      },
      {
        label: '1988',
        pgns: fromPgns.pgns1988,
      },
      {
        label: '1987',
        pgns: fromPgns.pgns1987,
      },
      {
        label: '1985',
        pgns: fromPgns.pgns1985,
      },
      {
        label: '1984',
        pgns: fromPgns.pgns1984,
      },
      {
        label: '1983',
        pgns: fromPgns.pgns1983,
      },
      {
        label: '1982',
        pgns: fromPgns.pgns1982,
      },
      {
        label: '1980',
        pgns: fromPgns.pgns1980,
      },
      {
        label: '1979',
        pgns: fromPgns.pgns1979,
      },
      {
        label: '1977',
        pgns: fromPgns.pgns1977,
      },
      {
        label: '1976',
        pgns: fromPgns.pgns1976,
      },
      {
        label: '1974',
        pgns: fromPgns.pgns1974,
      },
    ];
  }
}
