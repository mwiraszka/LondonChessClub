import { User } from '@app/shared/types';

export interface AuthState {
  user?: User;
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  token?: string;
}
