import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { AboutComponent } from '@app/pages/about';

@NgModule({
  declarations: [AboutComponent],
  imports: [ClarityModule, CommonModule],
})
export class AboutModule {}
