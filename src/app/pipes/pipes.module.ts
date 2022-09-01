import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateByCharsPipe } from './truncate-by-chars.pipe';

@NgModule({
  declarations: [TruncateByCharsPipe],
  imports: [CommonModule],
  exports: [TruncateByCharsPipe],
})
export class PipesModule {}
