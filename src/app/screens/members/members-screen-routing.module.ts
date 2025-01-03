import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MembersScreenComponent } from './members-screen.component';

const routes: Routes = [
  {
    path: '',
    component: MembersScreenComponent,
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
export class MembersScreenRoutingModule {}
