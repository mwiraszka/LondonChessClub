import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminControlsModule } from '@app/components/admin-controls';
import { LinkListModule } from '@app/components/link-list';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

import { ScheduleComponent } from './schedule.component';

@NgModule({
  declarations: [ScheduleComponent],
  imports: [
    AdminControlsModule,
    CommonModule,
    IconsModule,
    LinkListModule,
    PipesModule,
    RouterModule,
  ],
  exports: [ScheduleComponent],
})
export class ScheduleModule {}
