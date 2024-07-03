import { PDFProgressData } from 'ng2-pdf-viewer';

import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { LoaderService, MetaAndTitleService } from '@app/services';
import { ClubDocument } from '@app/types';

@Component({
  selector: 'lcc-documents-screen',
  templateUrl: './documents-screen.component.html',
  styleUrls: ['./documents-screen.component.scss'],
})
export class DocumentsScreenComponent implements OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('pdfViewer') pdfViewer!: TemplateRef<any>;

  documentSrc?: string;
  loadedPercentage = 100;

  readonly documents: ClubDocument[] = [
    {
      title: 'Club Bylaws',
      fileName: 'lcc-bylaws.pdf',
      datePublished: '2024-04-24',
      dateLastModified: '2024-04-24',
    },
    {
      title: 'Board Meeting - DEC 12, 2023 - Minutes',
      fileName: 'lcc-board-meeting-2023-12-12-minutes.pdf',
      datePublished: '2024-04-24',
      dateLastModified: '2024-04-24',
    },
    {
      title: 'Board Meeting - JAN 9, 2024 - Minutes',
      fileName: 'lcc-board-meeting-2024-01-09-minutes.pdf',
      datePublished: '2024-04-24',
      dateLastModified: '2024-04-24',
    },
    {
      title: 'Board Meeting - APR 2, 2024 - Minutes',
      fileName: 'lcc-board-meeting-2024-04-02-minutes.pdf',
      datePublished: '2024-04-24',
      dateLastModified: '2024-04-24',
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
    private metaAndTitleService: MetaAndTitleService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Documents');
    this.metaAndTitleService.updateDescription(
      'A place for all London Chess Club documentation.'
    );
  }

  ngOnDestroy(): void {
    this.onCloseViewer();
  }

  onSelectDocument(fileName: string): void {
    this.loaderService.display(true);
    this.documentSrc = `assets/documents/${fileName}`;
    this.viewContainerRef?.createEmbeddedView(this.pdfViewer);
  }

  onProgress(progressData: PDFProgressData): void {
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
