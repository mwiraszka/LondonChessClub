import { Component } from '@angular/core';

import { GameArchivesScreenFacade } from './game-archives-screen.facade';

@Component({
  selector: 'lcc-game-archives-screen',
  templateUrl: './game-archives-screen.component.html',
  styleUrls: ['./game-archives-screen.component.scss'],
  providers: [GameArchivesScreenFacade],
})
export class GameArchivesScreenComponent {
  constructor(public facade: GameArchivesScreenFacade) {}
}
