import { Component, Input } from '@angular/core';

import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import type { Article, Image } from '@app/models';
import {
  FormatDatePipe,
  IsDefinedPipe,
  TruncateByCharsPipe,
  WasEditedPipe,
} from '@app/pipes';

@Component({
  selector: 'lcc-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
  imports: [
    FormatDatePipe,
    ImagePreloadDirective,
    IsDefinedPipe,
    MarkdownRendererComponent,
    TruncateByCharsPipe,
    WasEditedPipe,
  ],
})
export class ArticleComponent {
  @Input({ required: true }) article!: Article;
  @Input({ required: true }) bannerImage!: Image | null;
}
