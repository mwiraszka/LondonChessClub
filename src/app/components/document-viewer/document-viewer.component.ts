import { PDFProgressData, PdfViewerModule } from 'ng2-pdf-viewer';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IconsModule } from '@app/icons';
import { DialogControls } from '@app/types';

@Component({
  selector: 'lcc-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  imports: [CommonModule, IconsModule, PdfViewerModule],
})
export class DocumentViewerComponent implements DialogControls {
  @Input() public documentPath?: string;

  public percentLoaded = 0;

  // Dialog controls
  @Output() public close = new EventEmitter<void>();
  @Output() public confirm = new EventEmitter<string>();

  public onProgress(progressData: PDFProgressData): void {
    this.percentLoaded = Math.floor((progressData.loaded / progressData.total) * 100);
  }
}
