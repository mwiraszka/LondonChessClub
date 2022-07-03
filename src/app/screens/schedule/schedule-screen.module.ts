import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { ScheduleModule } from '@app/shared/components/schedule';

import { ScheduleScreenComponent } from './schedule-screen.component';

@NgModule({
  declarations: [ScheduleScreenComponent],
  imports: [ClarityModule, CommonModule, ScheduleModule],
})
export class ScheduleScreenModule {}
