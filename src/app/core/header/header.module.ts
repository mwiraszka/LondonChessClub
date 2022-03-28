import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { HeaderComponent } from '@app/core/header';

@NgModule({
  declarations: [HeaderComponent],
  imports: [ClarityModule, CommonModule, RouterModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
