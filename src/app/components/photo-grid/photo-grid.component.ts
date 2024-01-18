import { Component, Input } from '@angular/core';

import { PhotoGridFacade } from './photo-grid.facade';

@Component({
  selector: 'lcc-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss'],
  providers: [PhotoGridFacade],
})
export class PhotoGridComponent {
  @Input() maxPhotos?: number;

  constructor(public facade: PhotoGridFacade) {}
}
