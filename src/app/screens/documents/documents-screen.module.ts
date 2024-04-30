import { PdfViewerModule } from 'ng2-pdf-viewer';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScreenHeaderModule } from '@app/components/screen-header';
import { IconsModule } from '@app/icons';
import { PipesModule } from '@app/pipes';

import { DocumentsScreenRoutingModule } from './documents-screen-routing.module';
import { DocumentsScreenComponent } from './documents-screen.component';

@NgModule({
  declarations: [DocumentsScreenComponent],
  imports: [
    CommonModule,
    DocumentsScreenRoutingModule,
    IconsModule,
    PdfViewerModule,
    PipesModule,
    ScreenHeaderModule,
  ],
  exports: [DocumentsScreenComponent],
})
export class DocumentsScreenModule {}
