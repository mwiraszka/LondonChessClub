import moment from 'moment-timezone';

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentViewerComponent } from '@app/components/document-viewer/document-viewer.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import IconsModule from '@app/icons';
import type { ClubDocument } from '@app/models';
import { FormatDatePipe } from '@app/pipes';
import { DialogService, MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-documents-page',
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss',
  imports: [
    CommonModule,
    FormatDatePipe,
    IconsModule,
    PageHeaderComponent,
    TooltipDirective,
  ],
})
export class DocumentsPageComponent implements OnInit, AfterViewInit {
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
      dateLastModified: moment('2025-03-20T00:00:00').toISOString(),
    },
    {
      title: 'Board Meeting - JAN 9, 2024 - Minutes',
      fileName: 'lcc-board-meeting-2024-01-09-minutes.pdf',
      datePublished: moment('2024-04-24T04:00:00').toISOString(),
      dateLastModified: moment('2025-03-20T00:00:00').toISOString(),
    },
    {
      title: 'Board Meeting - APR 2, 2024 - Minutes',
      fileName: 'lcc-board-meeting-2024-04-02-minutes.pdf',
      datePublished: moment('2024-04-24T04:00:00').toISOString(),
      dateLastModified: moment('2025-03-20T00:00:00').toISOString(),
    },
    {
      title: 'Membership Fees 2025 - 2028 (Incremental Plan to Break Even)',
      fileName: 'lcc-membership-fees-2025-to-2028.pdf',
      datePublished: '2025-01-24',
      dateLastModified: '2025-01-24',
    },
    {
      title: 'Code of Conduct',
      fileName: 'lcc-code-of-conduct.pdf',
      datePublished: '2025-03-20',
      dateLastModified: '2025-03-20',
    },
  ];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly metaAndTitleService: MetaAndTitleService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Documents');
    this.metaAndTitleService.updateDescription(
      'A place for all London Chess Club documentation.',
    );
  }

  ngAfterViewInit(): void {
    this.documents.forEach(document => {
      if (this.activatedRoute.snapshot.fragment === document.fileName) {
        this.onSelectDocument(document.fileName);
      }
    });
  }

  public async onSelectDocument(fileName: string): Promise<void> {
    // Update the URL fragment with the filename before opening the dialog
    await this.router.navigate([], {
      fragment: fileName,
      replaceUrl: false, // Preserve the history
    });

    // Open the dialog and wait for it to close
    await this.dialogService.open<DocumentViewerComponent, null>({
      componentType: DocumentViewerComponent,
      isModal: true,
      inputs: { documentPath: `assets/documents/${fileName}` },
    });
  }
}
