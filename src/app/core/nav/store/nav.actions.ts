import { createAction, props } from '@ngrx/store';

import { Link } from '@app/shared/types';

enum NavActionTypes {
  LINK_SELECTED = '[Nav] Link selected',

  HOME_TAB_SELECTED = '[Nav] Home tab selected',
  MEMBERS_TAB_SELECTED = '[Nav] Members tab selected',
  SCHEDULE_TAB_SELECTED = '[Nav] Schedule tab selected',
  NEWS_TAB_SELECTED = '[Nav] News tab selected',
  LONDON_CHESS_CHAMPION_TAB_SELECTED = '[Nav] London chess champion tab selected',
  PHOTO_GALLERY_TAB_SELECTED = '[Nav] Photo gallery tab selected',
  ABOUT_TAB_SELECTED = '[Nav] About tab selected',
  LOGIN_TAB_SELECTED = '[Nav] Login tab selected',

  DROPDOWN_TOGGLED = '[Nav] Dropdown toggled',
  DROPDOWN_CLOSED = '[Nav] Dropdown closed',
  LOG_OUT_SELECTED = '[Nav] Log out selected',
  RESEND_VERIFICATION_LINK_SELECTED = '[Nav] Resend verification link selected',
}

export const linkSelected = createAction(
  NavActionTypes.LINK_SELECTED,
  props<{ link: Link }>()
);

export const homeTabSelected = createAction(NavActionTypes.HOME_TAB_SELECTED);
export const membersTabSelected = createAction(NavActionTypes.MEMBERS_TAB_SELECTED);
export const scheduleTabSelected = createAction(NavActionTypes.SCHEDULE_TAB_SELECTED);
export const newsTabSelected = createAction(NavActionTypes.NEWS_TAB_SELECTED);
export const londonChessChampionTabSelected = createAction(
  NavActionTypes.LONDON_CHESS_CHAMPION_TAB_SELECTED
);
export const photoGalleryTabSelected = createAction(
  NavActionTypes.PHOTO_GALLERY_TAB_SELECTED
);
export const aboutTabSelected = createAction(NavActionTypes.ABOUT_TAB_SELECTED);
export const loginTabSelected = createAction(NavActionTypes.LOGIN_TAB_SELECTED);

export const dropdownToggled = createAction(NavActionTypes.DROPDOWN_TOGGLED);
export const dropdownClosed = createAction(NavActionTypes.DROPDOWN_CLOSED);
export const logOutSelected = createAction(NavActionTypes.LOG_OUT_SELECTED);
export const resendVerificationLinkSelected = createAction(
  NavActionTypes.RESEND_VERIFICATION_LINK_SELECTED
);
