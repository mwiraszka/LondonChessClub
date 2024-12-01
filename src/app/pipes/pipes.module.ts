import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormatDatePipe } from './format-date.pipe';
import { RangePipe } from './range.pipe';
import { SanitizeUrlPipe } from './sanitize-url.pipe';
import { StripMarkdownPipe } from './strip-markdown.pipe';
import { TruncateByCharsPipe } from './truncate-by-chars.pipe';

@NgModule({
  declarations: [
    FormatDatePipe,
    RangePipe,
    SanitizeUrlPipe,
    StripMarkdownPipe,
    TruncateByCharsPipe,
  ],
  imports: [CommonModule],
  exports: [
    FormatDatePipe,
    RangePipe,
    SanitizeUrlPipe,
    StripMarkdownPipe,
    TruncateByCharsPipe,
  ],
})
export class PipesModule {}
