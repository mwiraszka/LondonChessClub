import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LinkListModule } from '@app/components/link-list';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { ChampionScreenComponent } from './champion-screen.component';

@NgModule({
  declarations: [ChampionScreenComponent],
  imports: [CommonModule, LinkListModule, RouterModule, ScreenHeaderModule],
  exports: [ChampionScreenComponent],
})
export class ChampionScreenModule {}
