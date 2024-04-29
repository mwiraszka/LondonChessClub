import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from '@app/components/tooltip';
import { IconsModule } from '@app/icons';

import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, IconsModule, TooltipModule],
  exports: [FooterComponent],
})
export class FooterModule {}
