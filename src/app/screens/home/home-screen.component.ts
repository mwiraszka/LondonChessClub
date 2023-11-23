import { Component, OnInit } from '@angular/core';

import { Link, NavPathTypes, Photo } from '@app/types';
import { takeRandomly } from '@app/utils';

import { allPhotos } from '@assets/photos';

@Component({
  selector: 'lcc-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit {
  photos!: Photo[];

  scheduleLink: Link = {
    path: NavPathTypes.SCHEDULE,
    text: 'All scheduled events',
  };

  photoGalleryLink: Link = {
    path: NavPathTypes.PHOTO_GALLERY,
    text: 'More photos',
  };

  newsLink: Link = {
    path: NavPathTypes.NEWS,
    text: 'More news',
  };

  ngOnInit(): void {
    this.photos = takeRandomly(allPhotos, 10);
  }
}
