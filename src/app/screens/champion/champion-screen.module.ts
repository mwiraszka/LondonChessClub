import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ChampionScreenComponent } from '@app/screens/champion';

@NgModule({
  declarations: [ChampionScreenComponent],
  imports: [ClarityModule, CommonModule, RouterModule],
})
export class ChampionScreenModule {}
