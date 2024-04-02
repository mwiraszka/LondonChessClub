import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ModificationInfoModule } from '@app/components/modification-info';
import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { MemberFormComponent } from './member-form.component';

@NgModule({
  declarations: [MemberFormComponent],
  imports: [
    CommonModule,
    IconsModule,
    ModificationInfoModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  exports: [MemberFormComponent],
})
export class MemberFormModule {}
