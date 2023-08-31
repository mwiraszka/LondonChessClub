import { CognitoUserSession } from 'amazon-cognito-identity-js';

import { User } from '@app/types';

export interface AuthState {
  user: User | null;
  session: CognitoUserSession | null;
}

export const initialState: AuthState = {
  user: null,
  session: null,
};
