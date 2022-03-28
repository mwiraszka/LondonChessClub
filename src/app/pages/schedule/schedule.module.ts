import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { ScheduleComponent } from '@app/pages/schedule';

@NgModule({
  declarations: [ScheduleComponent],
  imports: [ClarityModule, CommonModule],
})
export class ScheduleModule {}
