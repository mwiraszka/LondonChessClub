import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { HomeComponent } from '@app/pages/home';

@NgModule({
  declarations: [HomeComponent],
  imports: [ClarityModule, CommonModule],
  exports: [HomeComponent],
})
export class HomeModule {}
