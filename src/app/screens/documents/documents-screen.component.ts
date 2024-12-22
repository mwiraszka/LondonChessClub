import moment from 'moment-timezone';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DocumentViewerComponent } from '@app/components/document-viewer/document-viewer.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { IconsModule } from '@app/icons';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { DialogService, MetaAndTitleService } from '@app/services';
import { ClubDocument } from '@app/types';

@Component({
  selector: 'lcc-documents-screen',
  templateUrl: './documents-screen.component.html',
  styleUrls: ['./documents-screen.component.scss'],
  imports: [CommonModule, FormatDatePipe, IconsModule, ScreenHeaderComponent],
})
export class DocumentsScreenComponent implements OnInit {
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

  constructor(
    private readonly dialogService: DialogService<DocumentViewerComponent>,
    private readonly metaAndTitleService: MetaAndTitleService,
  ) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Documents');
    this.metaAndTitleService.updateDescription(
      'A place for all London Chess Club documentation.',
    );
  }

  public onSelectDocument(fileName: string): void {
    this.dialogService.open({
      component: DocumentViewerComponent,
      inputs: { documentPath: `assets/documents/${fileName}` },
    });
  }
}
