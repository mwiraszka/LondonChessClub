import { createReducer, on, Action } from '@ngrx/store';

import * as ImageOverlayActions from './image-overlay.actions';
import { ImageOverlayState } from '../types/image-overlay.state';

const initialState: ImageOverlayState = {
  imagePath: null,
};

const modalReducer = createReducer(
  initialState,
  on(ImageOverlayActions.overlayOpened, (state, action) => ({
    ...state,
    imagePath: action.imagePath,
  })),
  on(ImageOverlayActions.overlayClosed, () => initialState)
);

export function reducer(state: ImageOverlayState, action: Action) {
  return modalReducer(state, action);
}
