export interface ModalButton {
  text: string;
  style: ModalButtonStyle;
  action: ModalButtonAction;
}

export enum ModalButtonStyle {
  PRIMARY_DEFAULT = 'lcc-primary-button',
  PRIMARY_SUCCESS = 'lcc-success-button',
  PRIMARY_WARNING = 'lcc-warning-button',
  SECONDARY = 'lcc-secondary-button',
}

export type ModalButtonStyleType =
  | ModalButtonStyle.PRIMARY_DEFAULT
  | ModalButtonStyle.PRIMARY_SUCCESS
  | ModalButtonStyle.PRIMARY_WARNING
  | ModalButtonStyle.SECONDARY;

export enum ModalButtonAction {
  LEAVE_OK = 'Leave OK',
  LEAVE_CANCEL = 'Leave cancel',
  ADD_MEMBER_OK = 'Add member OK',
  ADD_MEMBER_CANCEL = 'Add member cancel',
  UPDATE_MEMBER_OK = 'Update member OK',
  UPDATE_MEMBER_CANCEL = 'Update member cancel',
  DELETE_MEMBER_OK = 'Delete member OK',
  DELETE_MEMBER_CANCEL = 'Delete member cancel',
  PUBLISH_ARTICLE_OK = 'Publish article OK',
  PUBLISH_ARTICLE_CANCEL = 'Publish article cancel',
  UPDATE_ARTICLE_OK = 'Update article OK',
  UPDATE_ARTICLE_CANCEL = 'Update article cancel',
  DELETE_ARTICLE_OK = 'Delete article OK',
  DELETE_ARTICLE_CANCEL = 'Delete article cancel',
  ACTIVATE_VERSION_UPDATE = 'Activate version update',
}

export type ModalButtonActionType =
  | ModalButtonAction.LEAVE_OK
  | ModalButtonAction.LEAVE_CANCEL
  | ModalButtonAction.ADD_MEMBER_OK
  | ModalButtonAction.ADD_MEMBER_CANCEL
  | ModalButtonAction.UPDATE_MEMBER_OK
  | ModalButtonAction.UPDATE_MEMBER_CANCEL
  | ModalButtonAction.DELETE_MEMBER_OK
  | ModalButtonAction.DELETE_MEMBER_CANCEL
  | ModalButtonAction.PUBLISH_ARTICLE_OK
  | ModalButtonAction.PUBLISH_ARTICLE_CANCEL
  | ModalButtonAction.UPDATE_ARTICLE_OK
  | ModalButtonAction.UPDATE_ARTICLE_CANCEL
  | ModalButtonAction.DELETE_ARTICLE_OK
  | ModalButtonAction.DELETE_ARTICLE_CANCEL
  | ModalButtonAction.ACTIVATE_VERSION_UPDATE;
