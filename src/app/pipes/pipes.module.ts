import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormatDatePipe } from './format-date.pipe';
import { SanitizeUrlPipe } from './sanitize-url.pipe';
import { TruncateByCharsPipe } from './truncate-by-chars.pipe';

@NgModule({
  declarations: [FormatDatePipe, SanitizeUrlPipe, TruncateByCharsPipe],
  imports: [CommonModule],
  exports: [FormatDatePipe, SanitizeUrlPipe, TruncateByCharsPipe],
})
export class PipesModule {}
