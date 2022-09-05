import { User } from '@app/types';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

export interface AuthState {
  user: User | null;
  session?: CognitoUserSession;
}

export const initialState: AuthState = {
  user: null,
  session: null,
};
