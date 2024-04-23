import { PdfViewerModule } from 'ng2-pdf-viewer';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScreenHeaderModule } from '@app/components/screen-header';
import { IconsModule } from '@app/icons';

import { DocumentsScreenComponent } from './documents-screen.component';

@NgModule({
  declarations: [DocumentsScreenComponent],
  imports: [CommonModule, IconsModule, PdfViewerModule, ScreenHeaderModule],
  exports: [DocumentsScreenComponent],
})
export class DocumentsScreenModule {}
