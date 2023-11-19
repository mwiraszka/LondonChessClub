import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminControlsModule } from '@app/components/admin-controls';
import { LinkListModule } from '@app/components/link-list';
import { PipesModule } from '@app/pipes';

import { ScheduleComponent } from './schedule.component';

@NgModule({
  declarations: [ScheduleComponent],
  imports: [AdminControlsModule, CommonModule, LinkListModule, PipesModule],
  exports: [ScheduleComponent],
})
export class ScheduleModule {}
