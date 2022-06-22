import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LondonChessChampionComponent } from '@app/pages/london-chess-champion';

@NgModule({
  declarations: [LondonChessChampionComponent],
  imports: [CommonModule, RouterModule],
})
export class LondonChessChampionModule {}
