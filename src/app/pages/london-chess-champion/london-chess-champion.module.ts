import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { LondonChessChampionComponent } from '@app/pages/london-chess-champion';

@NgModule({
  declarations: [LondonChessChampionComponent],
  imports: [ClarityModule, CommonModule, RouterModule],
})
export class LondonChessChampionModule {}
