import { Toast } from '@app/types';

export interface ToasterState {
  toasts: Toast[];
}

export const initialState: ToasterState = {
  toasts: [],
};
