import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/guards/auth.guard';
import { UnsavedChangesGuard } from '@app/guards/unsaved-changes.guard';

import { EventEditorPageComponent } from './event-editor-page.component';

const routes: Routes = [
  {
    path: 'add',
    component: EventEditorPageComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedChangesGuard],
  },
  {
    path: 'edit/:event_id',
    component: EventEditorPageComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedChangesGuard],
  },
  {
    path: '**',
    redirectTo: 'add',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventPageRoutingModule {}
