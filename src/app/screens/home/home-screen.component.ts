import { Component } from '@angular/core';

import { Link, NavPathTypes, Photo } from '@app/types';

@Component({
  selector: 'lcc-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent {
  photos: Photo[] = [
    { index: 1, description: '' },
    { index: 2, description: '' },
    { index: 3, description: '' },
    { index: 4, description: '' },
    { index: 9, description: '' },
    { index: 10, description: '' },
    { index: 15, description: '' },
    { index: 13, description: '' },
  ];

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
    text: 'All articles',
  };
}
