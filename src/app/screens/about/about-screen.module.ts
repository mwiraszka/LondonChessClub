import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AboutModule } from '@app/shared/components/about';
import { ScreenHeaderModule } from '@app/shared/components/screen-header';

import { AboutScreenComponent } from './about-screen.component';
@NgModule({
  declarations: [AboutScreenComponent],
  imports: [AboutModule, CommonModule, RouterModule, ScreenHeaderModule],
})
export class AboutScreenModule {}
