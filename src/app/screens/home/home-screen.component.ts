import { Component } from '@angular/core';

import { Link, NavPathTypes } from '@app/types';

@Component({
  selector: 'lcc-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent {
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
}
