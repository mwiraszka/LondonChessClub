import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { HeaderComponent } from '@app/core/header';

@NgModule({
  declarations: [HeaderComponent],
  imports: [ClarityModule, CommonModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
