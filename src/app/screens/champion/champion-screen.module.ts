import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LinkListModule } from '@app/shared/components/link-list';
import { ScreenHeaderModule } from '@app/shared/components/screen-header';

import { ChampionScreenComponent } from './champion-screen.component';
@NgModule({
  declarations: [ChampionScreenComponent],
  imports: [CommonModule, LinkListModule, RouterModule, ScreenHeaderModule],
  exports: [ChampionScreenComponent],
})
export class ChampionScreenModule {}
