import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClubMapModule } from '@app/components/club-map';
import { IconsModule } from '@app/icons';

import { ClubSummaryComponent } from './club-summary.component';

@NgModule({
  declarations: [ClubSummaryComponent],
  imports: [ClubMapModule, CommonModule, IconsModule, RouterModule],
  exports: [ClubSummaryComponent],
})
export class ClubSummaryModule {}
