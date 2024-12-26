import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ImagePreloadDirective } from '@app/components/image-preload/image-preload.directive';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { FormatDatePipe, TruncateByCharsPipe } from '@app/pipes';
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
