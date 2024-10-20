import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { LinkListComponent } from './link-list.component';

@NgModule({
  declarations: [LinkListComponent],
  imports: [CommonModule, IconsModule, RouterModule, TooltipModule],
  exports: [LinkListComponent],
})
export class LinkListModule {}
