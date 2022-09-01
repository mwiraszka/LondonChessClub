import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScheduleModule } from '@app/components/schedule';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { ScheduleScreenComponent } from './schedule-screen.component';

@NgModule({
  declarations: [ScheduleScreenComponent],
  imports: [CommonModule, ScheduleModule, ScreenHeaderModule],
  exports: [ScheduleScreenComponent],
})
export class ScheduleScreenModule {}
