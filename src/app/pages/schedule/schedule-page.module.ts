import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { ScheduleModule } from '@app/shared/components/schedule';

import { SchedulePageComponent } from './schedule-page.component';

@NgModule({
  declarations: [SchedulePageComponent],
  imports: [ClarityModule, CommonModule, ScheduleModule],
})
export class SchedulePageModule {}
