import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ImagePreloadDirective } from '@app/components/image-preload/image-preload.directive';
import { MarkdownRendererComponent } from '@app/components/markdown-renderer/markdown-renderer.component';
import type { Article, Url } from '@app/models';
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
    CommonModule,
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
  @Input() bannerImageUrl?: Url | null;
}
