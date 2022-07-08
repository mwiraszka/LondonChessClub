import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { DirectivesModule } from '@app/shared/directives';

import { AdminControlsComponent } from './admin-controls.component';

@NgModule({
  declarations: [AdminControlsComponent],
  imports: [ClarityModule, CommonModule, DirectivesModule],
  exports: [AdminControlsComponent],
})
export class AdminControlsModule {}
