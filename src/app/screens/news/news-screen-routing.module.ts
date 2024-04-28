import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewsScreenComponent } from './news-screen.component';

const routes: Routes = [
  {
    path: '',
    component: NewsScreenComponent,
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
export class NewsScreenRoutingModule {}
