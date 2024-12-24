import { take } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { IconsModule } from '@app/icons';
import { FormatBytesPipe } from '@app/pipes/format-bytes.pipe';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { ImagesService, LoaderService } from '@app/services';
import { DialogOutput, Id, Image } from '@app/types';
import { generatePlaceholderImages } from '@app/utils';

@Component({
  selector: 'lcc-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrl: './image-explorer.component.scss',
  imports: [CommonModule, FormatBytesPipe, FormatDatePipe, IconsModule],
})
export class ImageExplorerComponent implements OnInit, DialogOutput<Id> {
  public images: Image[] = generatePlaceholderImages(25);

  @Output() public dialogResult = new EventEmitter<Id | 'close'>();

  constructor(
    private readonly imagesService: ImagesService,
    private readonly loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loaderService.setIsLoading(true);
    this.imagesService
      .getThumbnailImages()
      .pipe(take(1))
      .subscribe(images => {
        this.images = images;
        this.loaderService.setIsLoading(false);
      });
  }
}
