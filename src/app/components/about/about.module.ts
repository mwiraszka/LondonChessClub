import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps'
import { HttpClientJsonpModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, GoogleMapsModule, HttpClientJsonpModule, RouterModule],
  exports: [AboutComponent],
})
export class AboutModule {}
