import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LinkListModule } from '@app/components/link-list';

import { PgnViewerComponent } from './pgn-viewer.component';

@NgModule({
  declarations: [PgnViewerComponent],
  imports: [LinkListModule, CommonModule],
  exports: [PgnViewerComponent],
})
export class PgnViewerModule {}
