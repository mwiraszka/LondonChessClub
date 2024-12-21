import moment from 'moment-timezone';
import { PDFProgressData, PdfViewerModule } from 'ng2-pdf-viewer';

import { CommonModule, DOCUMENT } from '@angular/common';
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

import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { LoaderService, MetaAndTitleService } from '@app/services';
import { ClubDocument } from '@app/types';

@Component({
  selector: 'lcc-documents-screen',
  templateUrl: './documents-screen.component.html',
  styleUrls: ['./documents-screen.component.scss'],
  imports: [
    CommonModule,
    FormatDatePipe,
    IconsModule,
    PdfViewerModule,
    ScreenHeaderComponent,
  ],
})
export class DocumentsScreenComponent implements OnInit, OnDestroy {
  @ViewChild('pdfViewer') public readonly pdfViewer!: TemplateRef<any>;

  public documentSrc?: string;
  public readonly documents: ClubDocument[] = [
    {
      title: 'Club Bylaws',
      fileName: 'lcc-bylaws.pdf',
      datePublished: moment('2024-04-24T04:00:00').toISOString(),
      dateLastModified: moment('2024-04-24T04:00:00').toISOString(),
    },
    {
      title: 'Board Meeting - DEC 12, 2023 - Minutes',
      fileName: 'lcc-board-meeting-2023-12-12-minutes.pdf',
      datePublished: moment('2024-04-24T04:00:00').toISOString(),
      dateLastModified: moment('2024-04-24T04:00:00').toISOString(),
    },
    {
      title: 'Board Meeting - JAN 9, 2024 - Minutes',
      fileName: 'lcc-board-meeting-2024-01-09-minutes.pdf',
      datePublished: moment('2024-04-24T04:00:00').toISOString(),
      dateLastModified: moment('2024-04-24T04:00:00').toISOString(),
    },
    {
      title: 'Board Meeting - APR 2, 2024 - Minutes',
      fileName: 'lcc-board-meeting-2024-04-02-minutes.pdf',
      datePublished: moment('2024-04-24T04:00:00').toISOString(),
      dateLastModified: moment('2024-04-24T04:00:00').toISOString(),
    },
  ];
  public loadedPercentage = 100;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onCloseViewer();
    }
  }

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly loaderService: LoaderService,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Documents');
    this.metaAndTitleService.updateDescription(
      'A place for all London Chess Club documentation.',
    );
  }

  ngOnDestroy(): void {
    this.onCloseViewer();
  }

  public onSelectDocument(fileName: string): void {
    this.loaderService.setIsLoading(true);
    this.documentSrc = `assets/documents/${fileName}`;
    this.viewContainerRef?.createEmbeddedView(this.pdfViewer);
  }

  public onProgress(progressData: PDFProgressData): void {
    this.loadedPercentage = Math.floor((progressData.loaded / progressData.total) * 100);
  }

  public onDocumentLoaded(): void {
    this.renderer.addClass(this._document.body, 'lcc-disable-scrolling');
    this.loaderService.setIsLoading(false);
  }

  public onClickViewer(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  public onCloseViewer(): void {
    this.renderer.removeClass(this._document.body, 'lcc-disable-scrolling');
    this.viewContainerRef.clear();
  }
}
