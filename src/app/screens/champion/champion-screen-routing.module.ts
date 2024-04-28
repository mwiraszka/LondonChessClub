import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChampionScreenComponent } from './champion-screen.component';

const routes: Routes = [
  {
    path: '',
    component: ChampionScreenComponent,
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
export class ChampionScreenRoutingModule {}
