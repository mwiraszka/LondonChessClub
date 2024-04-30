import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScheduleModule } from '@app/components/schedule';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { ScheduleScreenRoutingModule } from './schedule-screen-routing.module';
import { ScheduleScreenComponent } from './schedule-screen.component';

@NgModule({
  declarations: [ScheduleScreenComponent],
  imports: [
    CommonModule,
    ScheduleModule,
    ScreenHeaderModule,
    ScheduleScreenRoutingModule,
  ],
  exports: [ScheduleScreenComponent],
})
export class ScheduleScreenModule {}
