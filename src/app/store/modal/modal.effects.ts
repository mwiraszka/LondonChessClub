import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { MembersActions, MembersSelectors } from '@app/store/members';
import { ScheduleActions, ScheduleSelectors } from '@app/store/schedule';
import { type Modal, ModalButtonActionTypes, ModalButtonStyleTypes } from '@app/types';

import * as ModalActions from './modal.actions';

@Injectable()
export class ModalEffects {
  openAddMemberModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberSelected),
      map(({ member }) => {
        const modal: Modal = {
          title: 'Confirm new member',
          body: `Add ${member.firstName} ${member.lastName} to database?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.ADD_MEMBER_CANCEL,
            },
            {
              text: 'Add',
              style: ModalButtonStyleTypes.CONFIRM,
              action: ModalButtonActionTypes.ADD_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  openUpdateMemberModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberSelected),
      concatLatestFrom(() => this.store.select(MembersSelectors.setMember)),
      map(([, setMember]) => {
        const modal: Modal = {
          title: 'Confirm member update',
          body: `Update ${setMember?.firstName} ${setMember?.lastName}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.UPDATE_MEMBER_CANCEL,
            },
            {
              text: 'Update',
              style: ModalButtonStyleTypes.CONFIRM,
              action: ModalButtonActionTypes.UPDATE_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  openDeleteMemberModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberSelected),
      map(({ member }) => {
        const modal: Modal = {
          title: 'Confirm member deletion',
          body: `Delete ${member.firstName} ${member.lastName}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.DELETE_MEMBER_CANCEL,
            },
            {
              text: 'Delete',
              style: ModalButtonStyleTypes.WARN_CONFIRM,
              action: ModalButtonActionTypes.DELETE_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  openAddEventModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.addEventSelected),
      map(({ event }) => {
        const modal: Modal = {
          title: 'Confirm new event',
          body: `Add ${event.title} to database?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.ADD_EVENT_CANCEL,
            },
            {
              text: 'Add',
              style: ModalButtonStyleTypes.CONFIRM,
              action: ModalButtonActionTypes.ADD_EVENT_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  openUpdateEventModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.updateEventSelected),
      concatLatestFrom(() => this.store.select(ScheduleSelectors.setEvent)),
      map(([, setEvent]) => {
        const modal: Modal = {
          title: 'Confirm event update',
          body: `Update ${setEvent?.title}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.UPDATE_EVENT_CANCEL,
            },
            {
              text: 'Update',
              style: ModalButtonStyleTypes.CONFIRM,
              action: ModalButtonActionTypes.UPDATE_EVENT_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  openDeleteEventModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.deleteEventSelected),
      map(({ event }) => {
        const modal: Modal = {
          title: 'Confirm event deletion',
          body: `Delete ${event.title}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.DELETE_EVENT_CANCEL,
            },
            {
              text: 'Delete',
              style: ModalButtonStyleTypes.WARN_CONFIRM,
              action: ModalButtonActionTypes.DELETE_EVENT_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  openPublishArticleModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleSelected),
      map(({ article }) => {
        const modal: Modal = {
          title: 'Confirm new article',
          body: `Publish ${article.title}`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.PUBLISH_ARTICLE_CANCEL,
            },
            {
              text: 'Publish',
              style: ModalButtonStyleTypes.CONFIRM,
              action: ModalButtonActionTypes.PUBLISH_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  openUpdateArticleModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleSelected),
      concatLatestFrom(() => this.store.select(ArticlesSelectors.setArticle)),
      map(([, originalArticle]) => {
        const modal: Modal = {
          title: 'Confirm article update',
          body: `Update ${originalArticle?.title}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.UPDATE_ARTICLE_CANCEL,
            },
            {
              text: 'Update',
              style: ModalButtonStyleTypes.CONFIRM,
              action: ModalButtonActionTypes.UPDATE_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  openDeleteArticleModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleSelected),
      map(({ article }) => {
        const modal: Modal = {
          title: 'Confirm article deletion',
          body: `Update ${article.title}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.DELETE_ARTICLE_CANCEL,
            },
            {
              text: 'Delete',
              style: ModalButtonStyleTypes.WARN_CONFIRM,
              action: ModalButtonActionTypes.DELETE_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  openUnsavedChangesModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ModalActions.leaveWithUnsavedChangesRequested),
      map(() => {
        const modal: Modal = {
          title: 'Unsaved changes',
          body: 'Are you sure you want to leave this screen? Any unsaved changes will be lost.',
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.CANCEL,
              action: ModalButtonActionTypes.LEAVE_CANCEL,
            },
            {
              text: 'Leave',
              style: ModalButtonStyleTypes.CONFIRM,
              action: ModalButtonActionTypes.LEAVE_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      }),
    );
  });

  closeModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ModalActions.selectionMade),
      map(() => ModalActions.modalClosed()),
    );
  });

  broadcastSelection$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ModalActions.selectionMade),
      filter(
        ({ action }) =>
          action === ModalButtonActionTypes.ADD_MEMBER_OK ||
          action === ModalButtonActionTypes.ADD_MEMBER_CANCEL ||
          action === ModalButtonActionTypes.UPDATE_MEMBER_OK ||
          action === ModalButtonActionTypes.UPDATE_MEMBER_CANCEL ||
          action === ModalButtonActionTypes.DELETE_MEMBER_OK ||
          action === ModalButtonActionTypes.DELETE_MEMBER_CANCEL ||
          action === ModalButtonActionTypes.ADD_EVENT_OK ||
          action === ModalButtonActionTypes.ADD_EVENT_CANCEL ||
          action === ModalButtonActionTypes.UPDATE_EVENT_OK ||
          action === ModalButtonActionTypes.UPDATE_EVENT_CANCEL ||
          action === ModalButtonActionTypes.DELETE_EVENT_OK ||
          action === ModalButtonActionTypes.DELETE_EVENT_CANCEL ||
          action === ModalButtonActionTypes.PUBLISH_ARTICLE_OK ||
          action === ModalButtonActionTypes.PUBLISH_ARTICLE_CANCEL ||
          action === ModalButtonActionTypes.UPDATE_ARTICLE_OK ||
          action === ModalButtonActionTypes.UPDATE_ARTICLE_CANCEL ||
          action === ModalButtonActionTypes.DELETE_ARTICLE_OK ||
          action === ModalButtonActionTypes.DELETE_ARTICLE_CANCEL,
      ),
      map(({ action }) => {
        switch (action) {
          case ModalButtonActionTypes.ADD_MEMBER_OK:
            return MembersActions.addMemberConfirmed();
          case ModalButtonActionTypes.ADD_MEMBER_CANCEL:
            return MembersActions.addMemberCancelled();
          case ModalButtonActionTypes.UPDATE_MEMBER_OK:
            return MembersActions.updateMemberConfirmed();
          case ModalButtonActionTypes.UPDATE_MEMBER_CANCEL:
            return MembersActions.updateMemberCancelled();
          case ModalButtonActionTypes.DELETE_MEMBER_OK:
            return MembersActions.deleteMemberConfirmed();
          case ModalButtonActionTypes.DELETE_MEMBER_CANCEL:
            return MembersActions.deleteMemberCancelled();

          case ModalButtonActionTypes.ADD_EVENT_OK:
            return ScheduleActions.addEventConfirmed();
          case ModalButtonActionTypes.ADD_EVENT_CANCEL:
            return ScheduleActions.addEventCancelled();
          case ModalButtonActionTypes.UPDATE_EVENT_OK:
            return ScheduleActions.updateEventConfirmed();
          case ModalButtonActionTypes.UPDATE_EVENT_CANCEL:
            return ScheduleActions.updateEventCancelled();
          case ModalButtonActionTypes.DELETE_EVENT_OK:
            return ScheduleActions.deleteEventConfirmed();
          case ModalButtonActionTypes.DELETE_EVENT_CANCEL:
            return ScheduleActions.deleteEventCancelled();

          case ModalButtonActionTypes.PUBLISH_ARTICLE_OK:
            return ArticlesActions.publishArticleConfirmed();
          case ModalButtonActionTypes.PUBLISH_ARTICLE_CANCEL:
            return ArticlesActions.publishArticleCancelled();
          case ModalButtonActionTypes.UPDATE_ARTICLE_OK:
            return ArticlesActions.updateArticleConfirmed();
          case ModalButtonActionTypes.UPDATE_ARTICLE_CANCEL:
            return ArticlesActions.updateArticleCancelled();
          case ModalButtonActionTypes.DELETE_ARTICLE_OK:
            return ArticlesActions.deleteArticleConfirmed();
          default:
            return ArticlesActions.deleteArticleCancelled();
        }
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
  ) {}
}
