import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as uuid from 'uuid';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FormatBytesPipe } from '@app/pipes/format-bytes.pipe';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { ImagesService } from '@app/services';
import { Id, Image } from '@app/types';

@UntilDestroy()
@Component({
  selector: 'lcc-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrls: ['./image-explorer.component.scss'],
  imports: [CommonModule, FormatBytesPipe, FormatDatePipe],
})
export class ImageExplorer implements OnInit {
  readonly PLACEHOLDER_IMAGE: Image = {
    articleAppearances: 0,
    dateUploaded: new Date().toISOString(),
    id: uuid.v4(),
    presignedUrl: '',
    size: 0,
  };

  images: Image[] = Array(25).fill(this.PLACEHOLDER_IMAGE);

  constructor(private imagesService: ImagesService) {}

  ngOnInit(): void {
    this.imagesService
      .getThumbnailImages()
      .pipe(untilDestroyed(this))
      .subscribe(images => {
        this.images = images;
      });
  }

  onSelectImage(id: Id): void {
    // TODO: set up callback/emitter mechanism in overlay service
  }
}
