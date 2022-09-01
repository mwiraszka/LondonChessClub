import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MembersTableModule } from '@app/components/members-table';
import { ScreenHeaderModule } from '@app/components/screen-header';

import { MembersScreenComponent } from './members-screen.component';

@NgModule({
  declarations: [MembersScreenComponent],
  imports: [CommonModule, MembersTableModule, ScreenHeaderModule],
  exports: [MembersScreenComponent],
})
export class MembersScreenModule {}
