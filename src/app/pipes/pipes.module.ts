import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormatDatePipe } from './format-date.pipe';
import { SanitizeUrlPipe } from './sanitize-url.pipe';
import { StripMarkdownPipe } from './strip-markdown.pipe';
import { TruncateByCharsPipe } from './truncate-by-chars.pipe';

@NgModule({
  declarations: [FormatDatePipe, SanitizeUrlPipe, StripMarkdownPipe, TruncateByCharsPipe],
  imports: [CommonModule],
  exports: [FormatDatePipe, SanitizeUrlPipe, StripMarkdownPipe, TruncateByCharsPipe],
})
export class PipesModule {}
