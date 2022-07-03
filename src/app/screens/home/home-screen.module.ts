import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeScreenComponent } from '@app/screens/home';
import { ScheduleModule } from '@app/shared/components/schedule';

@NgModule({
  declarations: [HomeScreenComponent],
  imports: [CommonModule, RouterModule, ScheduleModule],
  exports: [HomeScreenComponent],
})
export class HomeScreenModule {}
