import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangePasswordScreenComponent } from './change-password-screen.component';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordScreenComponent,
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
export class ChangePasswordScreenRoutingModule {}
