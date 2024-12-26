import { take } from 'rxjs/operators';
import * as uuid from 'uuid';

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import IconsModule from '@app/icons';
import { FormatBytesPipe, FormatDatePipe } from '@app/pipes';
import { ImagesService, LoaderService } from '@app/services';
import type { DialogOutput, Id, Image } from '@app/types';

@Component({
  selector: 'lcc-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrl: './image-explorer.component.scss',
  imports: [CommonModule, FormatBytesPipe, FormatDatePipe, IconsModule],
})
export class ImageExplorerComponent implements OnInit, DialogOutput<Id> {
  public images: Image[] = this.generatePlaceholderImages(25);

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

  private generatePlaceholderImages(count: number): Image[] {
    return Array(count).map(() => ({
      articleAppearances: 0,
      dateUploaded: new Date().toISOString(),
      id: uuid.v4(),
      presignedUrl: '',
      size: 0,
    }));
  }
}
