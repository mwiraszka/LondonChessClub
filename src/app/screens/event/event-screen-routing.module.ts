import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';
import { UnsavedEventGuard } from '@app/guards/unsaved-event.guard';
import { NavPathTypes } from '@app/types';

import { EventEditorScreenComponent } from './event-editor/event-editor-screen.component';

const routes: Routes = [
  {
    path: NavPathTypes.ADD,
    component: EventEditorScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedEventGuard],
  },
  {
    path: `${NavPathTypes.EDIT}/:event_id`,
    component: EventEditorScreenComponent,
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
