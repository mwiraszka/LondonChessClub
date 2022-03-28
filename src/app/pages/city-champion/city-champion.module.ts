import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { CityChampionComponent } from '@app/pages/city-champion';

@NgModule({
  declarations: [CityChampionComponent],
  imports: [ClarityModule, CommonModule],
})
export class CityChampionModule {}
