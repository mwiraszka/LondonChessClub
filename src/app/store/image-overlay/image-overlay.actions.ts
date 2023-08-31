import { createAction, props } from '@ngrx/store';

enum ImageOverlayActionTypes {
  OVERLAY_OPENED = '[Image Overlay] Overlay opened',
  OVERLAY_CLOSED = '[Image Overlay] Overlay closed',
}

export const overlayOpened = createAction(
  ImageOverlayActionTypes.OVERLAY_OPENED,
  props<{ imageUrl: string }>(),
);

export const overlayClosed = createAction(ImageOverlayActionTypes.OVERLAY_CLOSED);
