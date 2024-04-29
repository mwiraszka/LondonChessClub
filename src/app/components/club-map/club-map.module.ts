import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';

import { ClubMapComponent } from './club-map.component';

@NgModule({
  declarations: [ClubMapComponent],
  imports: [CommonModule, GoogleMapsModule, RouterModule],
  exports: [ClubMapComponent],
})
export class ClubMapModule {}
