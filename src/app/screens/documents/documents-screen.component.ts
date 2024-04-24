import { PDFProgressData } from 'ng2-pdf-viewer';

import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { LoaderService } from '@app/services';
import { ClubDocument } from '@app/types';

@Component({
  selector: 'lcc-documents-screen',
  templateUrl: './documents-screen.component.html',
  styleUrls: ['./documents-screen.component.scss'],
})
export class DocumentsScreenComponent implements OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('pdfViewer') pdfViewer!: TemplateRef<any>;

  documentSrc?: string;
  loadedPercentage = 100;

  readonly documents: ClubDocument[] = [
    {
      title: 'Club Bylaws',
      documentName: 'lcc-bylaws',
      datePublished: '2024-04-22',
      dateLastModified: '2024-04-22',
    },
    {
      title: 'Board Meeting - DEC 12, 2023 - Minutes',
      documentName: 'lcc-board-meeting-2023-12-12-minutes',
      datePublished: '2024-04-22',
      dateLastModified: '2024-04-22',
    },
    {
      title: 'Board Meeting - JAN 9, 2024 - Minutes',
      documentName: 'lcc-board-meeting-2024-01-09-minutes',
      datePublished: '2024-04-22',
      dateLastModified: '2024-04-22',
    },
    {
      title: 'Board Meeting - APR 2, 2024 - Minutes',
      documentName: 'lcc-board-meeting-2024-04-02-minutes',
      datePublished: '2024-04-22',
      dateLastModified: '2024-04-22',
    },
  ];

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onCloseViewer();
    }
  }

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private loaderService: LoaderService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  ngOnDestroy(): void {
    this.onCloseViewer();
  }

  onSelectDocument(documentName: string): void {
    this.loaderService.display(true);
    this.documentSrc = `assets/documents/${documentName}.pdf`;
    this.viewContainerRef?.createEmbeddedView(this.pdfViewer);
  }

  onProgress(progressData: PDFProgressData) {
    this.loadedPercentage = Math.floor((progressData.loaded / progressData.total) * 100);
  }

  onDocumentLoaded(): void {
    this.renderer.addClass(this._document.body, 'lcc-disable-scrolling');
    this.loaderService.display(false);
  }

  onClickViewer(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  onCloseViewer(): void {
    this.renderer.removeClass(this._document.body, 'lcc-disable-scrolling');
    this.viewContainerRef.clear();
  }
}
