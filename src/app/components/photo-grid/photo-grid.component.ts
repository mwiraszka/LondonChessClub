import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Photo } from '@app/types';

import { PhotoGridFacade } from './photo-grid.facade';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'lcc-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss'],
  providers: [PhotoGridFacade],
  imports: [CommonModule],
})
export class PhotoGridComponent implements OnInit {
  @Input() maxPhotos?: number;

  photos!: Photo[];

  constructor(public facade: PhotoGridFacade) {}

  ngOnInit(): void {
    this.facade.photos$.pipe(untilDestroyed(this)).subscribe(photos => {
      this.photos = photos?.slice(0, this.maxPhotos ?? photos.length);
    });
  }
}
