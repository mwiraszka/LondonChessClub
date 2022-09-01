export interface ModalButton {
  text: string;
  style: ModalButtonStyleTypes;
  action: ModalButtonActionTypes;
}

export enum ModalButtonStyleTypes {
  PRIMARY_DEFAULT = 'lcc-primary-button',
  PRIMARY_SUCCESS = 'lcc-success-button',
  PRIMARY_WARNING = 'lcc-warning-button',
  SECONDARY = 'lcc-secondary-button',
}

export enum ModalButtonActionTypes {
  LEAVE_OK = 'Leave OK',
  LEAVE_CANCEL = 'Leave cancel',
  ADD_MEMBER_OK = 'Add member OK',
  ADD_MEMBER_CANCEL = 'Add member cancel',
  UPDATE_MEMBER_OK = 'Update member OK',
  UPDATE_MEMBER_CANCEL = 'Update member cancel',
  DELETE_MEMBER_OK = 'Delete member OK',
  DELETE_MEMBER_CANCEL = 'Delete member cancel',
  ADD_EVENT_OK = 'Add event OK',
  ADD_EVENT_CANCEL = 'Add event cancel',
  UPDATE_EVENT_OK = 'Update event OK',
  UPDATE_EVENT_CANCEL = 'Update event cancel',
  DELETE_EVENT_OK = 'Delete event OK',
  DELETE_EVENT_CANCEL = 'Delete event cancel',
  PUBLISH_ARTICLE_OK = 'Publish article OK',
  PUBLISH_ARTICLE_CANCEL = 'Publish article cancel',
  UPDATE_ARTICLE_OK = 'Update article OK',
  UPDATE_ARTICLE_CANCEL = 'Update article cancel',
  DELETE_ARTICLE_OK = 'Delete article OK',
  DELETE_ARTICLE_CANCEL = 'Delete article cancel',
  ACTIVATE_VERSION_UPDATE = 'Activate version update',
}

export type ModalButtonActionTypesType =
  | ModalButtonActionTypes.LEAVE_OK
  | ModalButtonActionTypes.LEAVE_CANCEL
  | ModalButtonActionTypes.ADD_MEMBER_OK
  | ModalButtonActionTypes.ADD_MEMBER_CANCEL
  | ModalButtonActionTypes.UPDATE_MEMBER_OK
  | ModalButtonActionTypes.UPDATE_MEMBER_CANCEL
  | ModalButtonActionTypes.DELETE_MEMBER_OK
  | ModalButtonActionTypes.DELETE_MEMBER_CANCEL
  | ModalButtonActionTypes.ADD_EVENT_OK
  | ModalButtonActionTypes.ADD_EVENT_CANCEL
  | ModalButtonActionTypes.UPDATE_EVENT_OK
  | ModalButtonActionTypes.UPDATE_EVENT_CANCEL
  | ModalButtonActionTypes.DELETE_EVENT_OK
  | ModalButtonActionTypes.DELETE_EVENT_CANCEL
  | ModalButtonActionTypes.PUBLISH_ARTICLE_OK
  | ModalButtonActionTypes.PUBLISH_ARTICLE_CANCEL
  | ModalButtonActionTypes.UPDATE_ARTICLE_OK
  | ModalButtonActionTypes.UPDATE_ARTICLE_CANCEL
  | ModalButtonActionTypes.DELETE_ARTICLE_OK
  | ModalButtonActionTypes.DELETE_ARTICLE_CANCEL
  | ModalButtonActionTypes.ACTIVATE_VERSION_UPDATE;
