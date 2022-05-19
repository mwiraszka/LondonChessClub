import { User } from '@app/shared/types';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

export interface AuthState {
  user?: User;
  cognitoUserSession?: CognitoUserSession;
}
