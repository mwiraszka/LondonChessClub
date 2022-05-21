import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { AboutComponent } from '@app/pages/about';

@NgModule({
  declarations: [AboutComponent],
  imports: [ClarityModule, CommonModule, RouterModule],
})
export class AboutModule {}
