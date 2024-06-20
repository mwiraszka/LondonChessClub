import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventAlertComponent } from '@app/components/event-alert';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

@NgModule({
  declarations: [EventAlertComponent],
  imports: [CommonModule, IconsModule, PipesModule, RouterModule],
  exports: [EventAlertComponent],
})
export class EventAlertModule {}
