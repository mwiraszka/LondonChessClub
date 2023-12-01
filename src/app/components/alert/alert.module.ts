import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent } from '@app/components/alert';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, IconsModule, PipesModule],
  exports: [AlertComponent],
})
export class AlertModule {}
