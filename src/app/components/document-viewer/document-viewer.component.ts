import { PDFProgressData, PdfViewerModule } from 'ng2-pdf-viewer';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import IconsModule from '@app/icons';
import type { DialogOutput } from '@app/models';

@Component({
  selector: 'lcc-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss',
  imports: [CommonModule, IconsModule, PdfViewerModule],
})
export class DocumentViewerComponent implements DialogOutput<null> {
  @Input() public documentPath?: string;

  public percentLoaded = 0;

  @Output() public dialogResult = new EventEmitter<null | 'close'>();

  public onProgress(progressData: PDFProgressData): void {
    this.percentLoaded = Math.floor((progressData.loaded / progressData.total) * 100);
  }
}
