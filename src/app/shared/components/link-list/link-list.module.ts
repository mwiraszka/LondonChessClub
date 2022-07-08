import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { LinkListComponent } from './link-list.component';

@NgModule({
  declarations: [LinkListComponent],
  imports: [ClarityModule, CommonModule, RouterModule],
  exports: [LinkListComponent],
})
export class LinkListModule {}
