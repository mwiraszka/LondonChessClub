import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameArchivesScreenComponent } from './game-archives-screen.component';

const routes: Routes = [
  {
    path: '',
    component: GameArchivesScreenComponent,
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
export class GameArchivesScreenRoutingModule {}
