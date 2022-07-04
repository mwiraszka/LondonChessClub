import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleModule } from '@app/shared/components/schedule';
import { ScreenHeaderModule } from '@app/shared/components/screen-header';

import { ScheduleScreenComponent } from './schedule-screen.component';

@NgModule({
  declarations: [ScheduleScreenComponent],
  imports: [CommonModule, ScheduleModule, ScreenHeaderModule],
})
export class ScheduleScreenModule {}
