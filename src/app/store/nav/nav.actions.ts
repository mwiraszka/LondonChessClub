import { createAction, props } from '@ngrx/store';

import { Link } from '@app/types';

enum NavActionTypes {
  LINK_SELECTED = '[Nav] Link selected',

  HOME_NAVIGATION_REQUESTED = '[Nav] Home navigation requested',
  MEMBERS_NAVIGATION_REQUESTED = '[Nav] Members navigation requested',
  SCHEDULE_NAVIGATION_REQUESTED = '[Nav] Schedule navigation requested',
  NEWS_NAVIGATION_REQUESTED = '[Nav] News navigation requested',
  LONDON_CHESS_CHAMPION_NAVIGATION_REQUESTED = '[Nav] London chess champion navigation requested',
  PHOTO_GALLERY_NAVIGATION_REQUESTED = '[Nav] Photo gallery navigation requested',
  ABOUT_NAVIGATION_REQUESTED = '[Nav] About navigation requested',
  LOGIN_NAVIGATION_REQUESTED = '[Nav] Login navigation requested',

  DROPDOWN_TOGGLED = '[Nav] Dropdown toggled',
  DROPDOWN_CLOSED = '[Nav] Dropdown closed',
  LOG_OUT_SELECTED = '[Nav] Log out selected',
  RESEND_VERIFICATION_LINK_SELECTED = '[Nav] Resend verification link selected',
}

export const linkSelected = createAction(
  NavActionTypes.LINK_SELECTED,
  props<{ link: Link }>()
);

export const homeNavigationRequested = createAction(
  NavActionTypes.HOME_NAVIGATION_REQUESTED
);
export const membersNavigationRequested = createAction(
  NavActionTypes.MEMBERS_NAVIGATION_REQUESTED
);
export const scheduleNavigationRequested = createAction(
  NavActionTypes.SCHEDULE_NAVIGATION_REQUESTED
);
export const newsNavigationRequested = createAction(
  NavActionTypes.NEWS_NAVIGATION_REQUESTED
);
export const londonChessChampionNavigationRequested = createAction(
  NavActionTypes.LONDON_CHESS_CHAMPION_NAVIGATION_REQUESTED
);
export const photoGalleryNavigationRequested = createAction(
  NavActionTypes.PHOTO_GALLERY_NAVIGATION_REQUESTED
);
export const aboutNavigationRequested = createAction(
  NavActionTypes.ABOUT_NAVIGATION_REQUESTED
);
export const loginNavigationRequested = createAction(
  NavActionTypes.LOGIN_NAVIGATION_REQUESTED
);

export const dropdownToggled = createAction(NavActionTypes.DROPDOWN_TOGGLED);
export const dropdownClosed = createAction(NavActionTypes.DROPDOWN_CLOSED);
export const logOutSelected = createAction(NavActionTypes.LOG_OUT_SELECTED);
export const resendVerificationLinkSelected = createAction(
  NavActionTypes.RESEND_VERIFICATION_LINK_SELECTED
);
