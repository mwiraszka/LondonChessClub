import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutModule } from '@app/components/about';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { AboutScreenComponent } from './about-screen.component';

@NgModule({
  declarations: [AboutScreenComponent],
  imports: [AboutModule, CommonModule, ScreenHeaderModule],
})
export class AboutScreenModule {}
