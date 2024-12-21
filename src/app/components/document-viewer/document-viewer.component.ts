import { PDFProgressData, PdfViewerModule } from 'ng2-pdf-viewer';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';

import { IconsModule } from '@app/icons';
import { LoaderService } from '@app/services';
import { OVERLAY_DATA_TOKEN } from '@app/services/overlay.service';

@Component({
  selector: 'lcc-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  imports: [CommonModule, IconsModule, PdfViewerModule],
})
export class DocumentViewerComponent implements OnInit {
  public documentSrc!: string;
  public loadedPercentage = 0;

  @Output() public close = new EventEmitter<void>();

  constructor(
    private readonly loaderService: LoaderService,
    @Inject(OVERLAY_DATA_TOKEN) private data: string,
  ) {}

  ngOnInit(): void {
    this.documentSrc = this.data;
  }

  public onDocumentLoad(): void {
    this.loaderService.setIsLoading(false);
  }

  public onProgress(progressData: PDFProgressData): void {
    this.loadedPercentage = Math.floor((progressData.loaded / progressData.total) * 100);
  }
}
