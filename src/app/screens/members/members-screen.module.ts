import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MembersTableModule } from '@app/components/members-table';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { MembersScreenRoutingModule } from './members-screen-routing.module';
import { MembersScreenComponent } from './members-screen.component';

@NgModule({
  declarations: [MembersScreenComponent],
  imports: [
    CommonModule,
    MembersScreenRoutingModule,
    MembersTableModule,
    ScreenHeaderModule,
  ],
  exports: [MembersScreenComponent],
})
export class MembersScreenModule {}
