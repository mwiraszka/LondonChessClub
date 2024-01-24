import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PgnViewerComponent } from './pgn-viewer.component';

@NgModule({
  declarations: [PgnViewerComponent],
  imports: [CommonModule],
  exports: [PgnViewerComponent],
})
export class PgnViewerModule {}
