import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { IconsModule } from '@app/icons';
import { FormatBytesPipe } from '@app/pipes/format-bytes.pipe';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { ImagesService, LoaderService } from '@app/services';
import { Id, Image } from '@app/types';
import { generatePlaceholderImages } from '@app/utils';

@UntilDestroy()
@Component({
  selector: 'lcc-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrls: ['./image-explorer.component.scss'],
  imports: [CommonModule, FormatBytesPipe, FormatDatePipe, IconsModule],
})
export class ImageExplorerComponent implements OnInit, OnChanges {
  public images: Image[] = generatePlaceholderImages(25);

  @Output() public close = new EventEmitter<void>();
  @Output() public selectImage = new EventEmitter<Id>();

  constructor(
    private imagesService: ImagesService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loaderService.setIsLoading(true);
    this.imagesService
      .getThumbnailImages()
      .pipe(untilDestroyed(this))
      .subscribe(images => {
        this.images = images;
        this.loaderService.setIsLoading(false);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      console.log(':: images', this.images);
    }
  }
}
