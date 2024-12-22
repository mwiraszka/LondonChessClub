import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ImagePreloadDirective } from '@app/components/image-preload/image-preload.directive';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { TruncateByCharsPipe } from '@app/pipes/truncate-by-chars.pipe';
import type { Article } from '@app/types';
import { wasEdited } from '@app/utils';

@Component({
  selector: 'lcc-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
  imports: [
    CommonModule,
    FormatDatePipe,
    ImagePreloadDirective,
    MarkdownRendererComponent,
    TruncateByCharsPipe,
  ],
})
export class ArticleComponent {
  readonly wasEdited = wasEdited;

  @Input() article?: Article;
}
