import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangePasswordPageComponent } from './change-password-page.component';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordPageComponent,
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
export class ChangePasswordPageRoutingModule {}
