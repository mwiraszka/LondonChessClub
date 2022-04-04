import { User } from '@app/shared/types';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
