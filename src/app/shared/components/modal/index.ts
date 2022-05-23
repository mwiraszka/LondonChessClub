export { ModalComponent } from './modal.component';
export { ModalModule } from './modal.module';

export * as ModalActions from './store/modal.actions';
export { ModalEffects } from './store/modal.effects';
export * as ModalSelectors from './store/modal.selectors';
export { reducer } from './store/modal.reducer';

export { Modal } from './types/modal.model';
export {
  ModalButton,
  ModalButtonAction,
  ModalButtonActionType,
  ModalButtonStyle,
  ModalButtonStyleType,
} from './types/modal-button.model';
export { ModalState } from './types/modal.state';
