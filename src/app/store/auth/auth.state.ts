import type { User } from '@app/types';

export interface AuthState {
  user: User | null;
  hasCode: boolean;
  temporaryPassword: string | null;
}

export const initialState: AuthState = {
  user: null,
  hasCode: false,
  temporaryPassword: null,
};
