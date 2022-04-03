import { createAction } from '@ngrx/store';

enum NavActionTypes {
  HOME_SELECTED = '[Nav] Home selected',
  MEMBERS_SELECTED = '[Nav] Members selected',
  SCHEDULE_SELECTED = '[Nav] Schedule selected',
  NEWS_SELECTED = '[Nav] News selected',
  CITY_CHAMPION_SELECTED = '[Nav] City champion selected',
  LESSONS_SELECTED = '[Nav] Lessons selected',
  SUPPLIES_SELECTED = '[Nav] Supplies selected',
  ABOUT_SELECTED = '[Nav] About selected',
  LOGIN_SELECTED = '[Nav] Login selected',
  LOGOUT_SELECTED = '[Nav] Logout selected',
}

export const homeSelected = createAction(NavActionTypes.HOME_SELECTED);
export const membersSelected = createAction(NavActionTypes.MEMBERS_SELECTED);
export const scheduleSelected = createAction(NavActionTypes.SCHEDULE_SELECTED);
export const newsSelected = createAction(NavActionTypes.NEWS_SELECTED);
export const cityChampionSelected = createAction(NavActionTypes.CITY_CHAMPION_SELECTED);
export const lessonsSelected = createAction(NavActionTypes.LESSONS_SELECTED);
export const suppliesSelected = createAction(NavActionTypes.SUPPLIES_SELECTED);
export const aboutSelected = createAction(NavActionTypes.ABOUT_SELECTED);
export const loginSelected = createAction(NavActionTypes.LOGIN_SELECTED);
export const logoutSelected = createAction(NavActionTypes.LOGOUT_SELECTED);
