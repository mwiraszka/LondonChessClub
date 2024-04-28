import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentsScreenComponent } from './documents-screen.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsScreenComponent,
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
export class DocumentsScreenRoutingModule {}
