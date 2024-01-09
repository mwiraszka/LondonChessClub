import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AlertComponent } from '@app/components/alert';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

@NgModule({
  declarations: [AlertComponent],
  imports: [CommonModule, IconsModule, PipesModule, RouterModule],
  exports: [AlertComponent],
})
export class AlertModule {}
