import { createAction } from '@ngrx/store';

enum NavActionTypes {
  HOME_SELECTED = '[Nav] Home selected',
  MEMBERS_SELECTED = '[Nav] Members selected',
  SCHEDULE_SELECTED = '[Nav] Schedule selected',
  NEWS_SELECTED = '[Nav] News selected',
  CITY_CHAMPION_SELECTED = '[Nav] City champion selected',
  PHOTO_GALLERY_SELECTED = '[Nav] Photo gallery selected',
  ABOUT_SELECTED = '[Nav] About selected',

  LOGIN_SELECTED = '[Nav] Login selected',
  LOGOUT_SELECTED = '[Nav] Logout selected',
}

export const homeSelected = createAction(NavActionTypes.HOME_SELECTED);
export const membersSelected = createAction(NavActionTypes.MEMBERS_SELECTED);
export const scheduleSelected = createAction(NavActionTypes.SCHEDULE_SELECTED);
export const newsSelected = createAction(NavActionTypes.NEWS_SELECTED);
export const cityChampionSelected = createAction(NavActionTypes.CITY_CHAMPION_SELECTED);
export const photoGallerySelected = createAction(NavActionTypes.PHOTO_GALLERY_SELECTED);
export const aboutSelected = createAction(NavActionTypes.ABOUT_SELECTED);

export const loginSelected = createAction(NavActionTypes.LOGIN_SELECTED);
export const logoutSelected = createAction(NavActionTypes.LOGOUT_SELECTED);
