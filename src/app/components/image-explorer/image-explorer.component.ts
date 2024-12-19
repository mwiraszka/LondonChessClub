import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, startWith } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { IconsModule } from '@app/icons';
import { FormatBytesPipe } from '@app/pipes/format-bytes.pipe';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { ImagesService, LoaderService } from '@app/services';
import { Id, Image } from '@app/types';
import { generatePlaceholderImages, isDefined } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrls: ['./image-explorer.component.scss'],
  imports: [CommonModule, FormatBytesPipe, FormatDatePipe, IconsModule],
})
export class ImageExplorerComponent implements OnInit {
  public images: Image[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() selectImage = new EventEmitter<Id>();

  constructor(
    private imagesService: ImagesService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loaderService.setIsLoading(true);
    this.imagesService
      .getThumbnailImages()
      .pipe(
        startWith(generatePlaceholderImages(25)),
        filter(isDefined),
        untilDestroyed(this),
      )
      .subscribe(images => {
        this.images = images;
        this.loaderService.setIsLoading(false);
      });
  }
}
