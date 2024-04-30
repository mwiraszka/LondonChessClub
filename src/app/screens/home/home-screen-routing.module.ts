import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeScreenComponent } from './home-screen.component';

const routes: Routes = [
  {
    path: '',
    component: HomeScreenComponent,
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
export class HomeScreenRoutingModule {}
