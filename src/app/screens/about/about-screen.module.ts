import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutModule } from '@app/components/about';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { AboutScreenRoutingModule } from './about-screen-routing.module';
import { AboutScreenComponent } from './about-screen.component';

@NgModule({
  declarations: [AboutScreenComponent],
  imports: [
    AboutModule,
    AboutScreenRoutingModule,
    CommonModule,
    RouterModule,
    ScreenHeaderModule,
  ],
})
export class AboutScreenModule {}
