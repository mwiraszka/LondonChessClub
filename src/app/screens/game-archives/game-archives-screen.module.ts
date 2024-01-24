import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PgnViewerModule } from '@app/components/pgn-viewer';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { GameArchivesScreenComponent } from './game-archives-screen.component';

@NgModule({
  declarations: [GameArchivesScreenComponent],
  imports: [CommonModule, PgnViewerModule, ScreenHeaderModule],
})
export class GameArchivesScreenModule {}
