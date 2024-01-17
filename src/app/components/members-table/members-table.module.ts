import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminControlsModule } from '@app/components/admin-controls';
import { LinkListModule } from '@app/components/link-list';
import { PaginatorModule } from '@app/components/paginator';
import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

import { MembersTableComponent } from './members-table.component';

@NgModule({
  declarations: [MembersTableComponent],
  imports: [
    AdminControlsModule,
    CommonModule,
    IconsModule,
    LinkListModule,
    PaginatorModule,
    PipesModule,
    TooltipModule,
  ],
  exports: [MembersTableComponent],
})
export class MembersTableModule {}
