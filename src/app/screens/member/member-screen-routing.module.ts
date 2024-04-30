import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, UnsavedMemberGuard } from '@app/guards';
import { NavPathTypes } from '@app/types';

import { MemberEditorComponent } from './member-editor';

const routes: Routes = [
  {
    path: NavPathTypes.ADD,
    component: MemberEditorComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedMemberGuard],
  },
  {
    path: `${NavPathTypes.EDIT}/:member_id`,
    component: MemberEditorComponent,
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedMemberGuard],
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
export class MemberScreenRoutingModule {}
