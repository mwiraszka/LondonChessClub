import { FeatherModule } from 'angular-feather';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminControlsModule } from '@app/components/admin-controls';
import { LinkListModule } from '@app/components/link-list';
import { PaginatorModule } from '@app/components/paginator';
import { TooltipModule } from '@app/components/tooltip';

import { MembersTableComponent } from './members-table.component';

@NgModule({
  declarations: [MembersTableComponent],
  imports: [
    AdminControlsModule,
    CommonModule,
    FeatherModule,
    LinkListModule,
    PaginatorModule,
    TooltipModule,
  ],
  exports: [MembersTableComponent],
})
export class MembersTableModule {}
