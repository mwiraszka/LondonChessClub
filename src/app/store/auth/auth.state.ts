import { User } from '@app/types';

export interface AuthState {
  user: User | null;
  hasCode: boolean;
}

export const initialState: AuthState = {
  user: null,
  hasCode: false,
};
