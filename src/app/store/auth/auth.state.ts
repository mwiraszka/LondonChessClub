import { User } from '@app/types';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

export interface AuthState {
  user: User | null;
  cognitoUserSession?: CognitoUserSession;
}

export const initialState: AuthState = {
  user: null,
  cognitoUserSession: null,
};
