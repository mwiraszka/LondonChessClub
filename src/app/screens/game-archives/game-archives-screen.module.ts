import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScreenHeaderModule } from '@app/components/screen-header';

import { GameArchivesScreenComponent } from './game-archives-screen.component';

@NgModule({
  declarations: [GameArchivesScreenComponent],
  imports: [CommonModule, ScreenHeaderModule],
})
export class GameArchivesScreenModule {}
