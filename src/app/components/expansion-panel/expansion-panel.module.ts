import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconsModule } from '@app/icons';

import { ExpansionPanelComponent } from './expansion-panel.component';

@NgModule({
  declarations: [ExpansionPanelComponent],
  imports: [CommonModule, IconsModule],
  exports: [ExpansionPanelComponent],
})
export class ExpansionPanelModule {}
