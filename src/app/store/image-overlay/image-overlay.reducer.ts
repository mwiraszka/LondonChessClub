import { Action, createReducer, on } from '@ngrx/store';

import * as ImageOverlayActions from './image-overlay.actions';
import { ImageOverlayState, initialState } from './image-overlay.state';

const modalReducer = createReducer(
  initialState,
  on(ImageOverlayActions.overlayOpened, (state, action) => ({
    ...state,
    imageUrl: action.imageUrl,
  })),
  on(ImageOverlayActions.overlayClosed, () => initialState),
);

export function reducer(state: ImageOverlayState, action: Action) {
  return modalReducer(state, action);
}
