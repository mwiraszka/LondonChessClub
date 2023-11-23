import { createAction, props } from '@ngrx/store';

import { Photo } from '@app/types';

enum ImageOverlayActionTypes {
  OVERLAY_OPENED = '[Image Overlay] Overlay opened',
  OVERLAY_CLOSED = '[Image Overlay] Overlay closed',
}

export const overlayOpened = createAction(
  ImageOverlayActionTypes.OVERLAY_OPENED,
  props<{ photo: Photo }>(),
);

export const overlayClosed = createAction(ImageOverlayActionTypes.OVERLAY_CLOSED);
