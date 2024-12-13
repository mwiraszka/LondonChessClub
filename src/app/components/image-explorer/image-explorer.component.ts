import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { FormatBytesPipe } from '@app/pipes/format-bytes.pipe';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { ImagesService } from '@app/services';
import { Image } from '@app/types';

@Component({
  selector: 'lcc-image-explorer',
  templateUrl: './image-explorer.component.html',
  styleUrls: ['./image-explorer.component.scss'],
  imports: [CommonModule, FormatBytesPipe, FormatDatePipe],
})
export class ImageExplorer implements OnInit {
  images$?: Observable<Image[]>;

  constructor(private imagesService: ImagesService) {}

  ngOnInit(): void {
    this.images$ = this.imagesService.getThumbnailImages();
  }
}
