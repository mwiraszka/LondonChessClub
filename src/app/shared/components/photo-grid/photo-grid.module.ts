import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotoGridComponent } from './photo-grid.component';

@NgModule({
  declarations: [PhotoGridComponent],
  imports: [CommonModule],
  exports: [PhotoGridComponent],
})
export class PhotoGridModule {}
