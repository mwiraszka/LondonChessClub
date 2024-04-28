import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScheduleScreenComponent } from './schedule-screen.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleScreenComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleScreenRoutingModule {}
