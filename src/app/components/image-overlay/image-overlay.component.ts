import { ClarityIcons, windowCloseIcon } from '@cds/core/icon';

import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { ImageOverlayFacade } from './image-overlay.facade';

@Component({
  selector: 'lcc-image-overlay',
  templateUrl: './image-overlay.component.html',
  styleUrls: ['./image-overlay.component.scss'],
  providers: [ImageOverlayFacade],
})
export class ImageOverlayComponent implements OnInit, OnDestroy {
  constructor(public facade: ImageOverlayFacade, private renderer: Renderer2) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(windowCloseIcon);
    this.renderer.addClass(document.body, 'lcc-disable-scrolling');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'lcc-disable-scrolling');
  }
}
