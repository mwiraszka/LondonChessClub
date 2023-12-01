import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IconsModule } from '@app/icons';

import { LinkListComponent } from './link-list.component';

@NgModule({
  declarations: [LinkListComponent],
  imports: [CommonModule, IconsModule, RouterModule],
  exports: [LinkListComponent],
})
export class LinkListModule {}
