import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as NavActions from './nav.actions';

@Injectable()
export class NavFacade {
  constructor(private readonly store: Store) {}

  onHomeTabSelected(): void {
    this.store.dispatch(NavActions.homeTabSelected());
  }

  onMembersTabSelected(): void {
    this.store.dispatch(NavActions.membersTabSelected());
  }

  onScheduleTabSelected(): void {
    this.store.dispatch(NavActions.scheduleTabSelected());
  }

  onNewsTabSelected(): void {
    this.store.dispatch(NavActions.newsTabSelected());
  }

  onCityChampionTabSelected(): void {
    this.store.dispatch(NavActions.cityChampionTabSelected());
  }

  onLessonsTabSelected(): void {
    this.store.dispatch(NavActions.lessonsTabSelected());
  }

  onSuppliesTabSelected(): void {
    this.store.dispatch(NavActions.suppliesTabSelected());
  }

  onAboutTabSelected(): void {
    this.store.dispatch(NavActions.aboutTabSelected());
  }

  onLoginSelected(): void {
    this.store.dispatch(NavActions.loginSelected());
  }
}
