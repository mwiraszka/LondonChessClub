import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScreenHeaderModule } from '@app/components/screen-header';

import { AboutScreenRoutingModule } from './about-screen-routing.module';
import { AboutScreenComponent } from './about-screen.component';

@NgModule({
  declarations: [AboutScreenComponent],
  imports: [AboutScreenRoutingModule, CommonModule, ScreenHeaderModule],
})
export class AboutScreenModule {}
