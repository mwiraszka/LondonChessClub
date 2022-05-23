import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AboutComponent } from '@app/pages/about';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, RouterModule],
})
export class AboutModule {}
