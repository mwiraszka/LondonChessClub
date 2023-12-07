import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

import { ModificationInfoComponent } from './modification-info.component';

@NgModule({
  declarations: [ModificationInfoComponent],
  imports: [CommonModule, IconsModule, PipesModule],
  exports: [ModificationInfoComponent],
})
export class ModificationInfoModule {}
