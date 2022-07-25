import { Component } from '@angular/core';

import { MOCK_EVENTS } from '@app/screens/schedule/mock-events';
import { Link, NavPathTypes, Photo } from '@app/shared/types';

@Component({
  selector: 'lcc-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent {
  mockEvents = MOCK_EVENTS.slice(0, 3); // temp

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
    text: 'See all scheduled events',
  };

  photoGalleryLink: Link = {
    path: NavPathTypes.PHOTO_GALLERY,
    text: 'See more photos',
  };
}
