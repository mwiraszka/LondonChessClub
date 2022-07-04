import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { LinkListComponent } from './link-list.component';

@NgModule({
  declarations: [LinkListComponent],
  imports: [ClarityModule, CommonModule],
  exports: [LinkListComponent],
})
export class LinkListModule {}
