import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminControlsModule } from '@app/components/admin-controls';
import { LinkListModule } from '@app/components/link-list';

import { ScheduleComponent } from './schedule.component';

@NgModule({
  declarations: [ScheduleComponent],
  imports: [AdminControlsModule, CommonModule, LinkListModule],
  exports: [ScheduleComponent],
})
export class ScheduleModule {}
