import { createAction, props } from '@ngrx/store';

import { Photo } from '@app/types';

export const photoSelected = createAction(
  '[Photos] Photo selected',
  props<{ photo: Photo }>(),
);
export const previousPhotoRequested = createAction('[Photos] Previous photo requested');
export const nextPhotoRequested = createAction('[Photos] Next photo requested');
