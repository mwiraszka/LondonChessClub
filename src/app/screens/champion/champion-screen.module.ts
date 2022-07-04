import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ScreenHeaderModule } from '@app/shared/components/screen-header';

import { ChampionScreenComponent } from './champion-screen.component';
@NgModule({
  declarations: [ChampionScreenComponent],
  imports: [CommonModule, RouterModule, ScreenHeaderModule],
})
export class ChampionScreenModule {}
