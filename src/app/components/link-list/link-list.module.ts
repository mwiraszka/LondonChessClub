import { FeatherModule } from 'angular-feather';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LinkListComponent } from './link-list.component';

@NgModule({
  declarations: [LinkListComponent],
  imports: [CommonModule, FeatherModule, RouterModule],
  exports: [LinkListComponent],
})
export class LinkListModule {}
