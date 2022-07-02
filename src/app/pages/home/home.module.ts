import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from '@app/pages/home';
import { ScheduleModule } from '@app/shared/components/schedule';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, RouterModule, ScheduleModule],
  exports: [HomeComponent],
})
export class HomeModule {}
