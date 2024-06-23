import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UpcomingEventBannerComponent } from '@app/components/upcoming-event-banner';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

@NgModule({
  declarations: [UpcomingEventBannerComponent],
  imports: [CommonModule, IconsModule, PipesModule, RouterModule],
  exports: [UpcomingEventBannerComponent],
})
export class UpcomingEventBannerModule {}
