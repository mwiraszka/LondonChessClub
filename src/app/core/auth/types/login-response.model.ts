import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

export interface LoginResponse {
  cognitoUser?: CognitoUser;
  cognitoUserSession?: CognitoUserSession;
  error?: Error;
}
