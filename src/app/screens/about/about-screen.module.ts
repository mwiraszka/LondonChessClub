import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { AboutScreenComponent } from './about-screen.component';

@NgModule({
  declarations: [AboutScreenComponent],
  imports: [ClarityModule, CommonModule, RouterModule],
})
export class AboutScreenModule {}
