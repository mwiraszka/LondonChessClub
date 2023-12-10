import { MarkdownModule } from 'ngx-markdown';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarkdownRendererComponent } from './markdown-renderer.component';

@NgModule({
  declarations: [MarkdownRendererComponent],
  imports: [CommonModule, MarkdownModule],
  exports: [MarkdownRendererComponent],
})
export class MarkdownRendererModule {}
