import { createAction } from '@ngrx/store';

enum NavActionTypes {
  HOME_TAB_SELECTED = '[Nav] Home tab selected',
  MEMBERS_TAB_SELECTED = '[Nav] Members tab selected',
  SCHEDULE_TAB_SELECTED = '[Nav] Schedule tab selected',
  NEWS_TAB_SELECTED = '[Nav] News tab selected',
  CITY_CHAMPION_TAB_SELECTED = '[Nav] City champion tab selected',
  LESSONS_TAB_SELECTED = '[Nav] Lessons tab selected',
  SUPPLIES_TAB_SELECTED = '[Nav] Supplies tab selected',
  ABOUT_TAB_SELECTED = '[Nav] About tab selected',
  LOGIN_SELECTED = '[Nav] Login selected',
}

export const homeTabSelected = createAction(NavActionTypes.HOME_TAB_SELECTED);
export const membersTabSelected = createAction(NavActionTypes.MEMBERS_TAB_SELECTED);
export const scheduleTabSelected = createAction(NavActionTypes.SCHEDULE_TAB_SELECTED);
export const newsTabSelected = createAction(NavActionTypes.NEWS_TAB_SELECTED);
export const cityChampionTabSelected = createAction(
  NavActionTypes.CITY_CHAMPION_TAB_SELECTED
);
export const lessonsTabSelected = createAction(NavActionTypes.LESSONS_TAB_SELECTED);
export const suppliesTabSelected = createAction(NavActionTypes.SUPPLIES_TAB_SELECTED);
export const aboutTabSelected = createAction(NavActionTypes.ABOUT_TAB_SELECTED);
export const loginSelected = createAction(NavActionTypes.LOGIN_SELECTED);
