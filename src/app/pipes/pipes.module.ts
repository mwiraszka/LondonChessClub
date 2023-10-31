import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SanitizeUrlPipe } from './sanitize-url.pipe';
import { TruncateByCharsPipe } from './truncate-by-chars.pipe';

@NgModule({
  declarations: [SanitizeUrlPipe, TruncateByCharsPipe],
  imports: [CommonModule],
  exports: [SanitizeUrlPipe, TruncateByCharsPipe],
})
export class PipesModule {}
