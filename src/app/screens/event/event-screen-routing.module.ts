import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, UnsavedEventGuard } from '@app/guards';
import { NavPathTypes } from '@app/types';

import { EventEditorComponent } from './event-editor';

const routes: Routes = [
  {
    path: NavPathTypes.ADD,
    component: EventEditorComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedEventGuard],
  },
  {
    path: `${NavPathTypes.EDIT}/:event_id`,
    component: EventEditorComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedEventGuard],
  },
  {
    path: '**',
    redirectTo: NavPathTypes.ADD,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventScreenRoutingModule {}
