import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { FormatBytesPipe } from '@app/pipes/format-bytes.pipe';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { ImagesService } from '@app/services';
import { Id, Image } from '@app/types';
import { generatePlaceholderImages } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrls: ['./image-explorer.component.scss'],
  imports: [CommonModule, FormatBytesPipe, FormatDatePipe],
})
export class ImageExplorerComponent implements OnInit {
  images: Image[] = generatePlaceholderImages(25);

  @Output() selectImage = new EventEmitter<Id>();

  constructor(private imagesService: ImagesService) {}

  ngOnInit(): void {
    this.imagesService
      .getThumbnailImages()
      .pipe(untilDestroyed(this))
      .subscribe(images => {
        this.images = images;
      });
  }

  onSelectImage(id?: Id): void {
    if (!id) {
      return;
    }
    this.selectImage.emit(id);
  }
}
