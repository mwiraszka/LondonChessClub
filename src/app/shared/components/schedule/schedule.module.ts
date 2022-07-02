import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleComponent } from './schedule.component';

@NgModule({
  declarations: [ScheduleComponent],
  imports: [CommonModule],
  exports: [ScheduleComponent],
})
export class ScheduleModule {}
