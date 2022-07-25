import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

export interface SignUpResponse {
  cognitoUser?: CognitoUser;
  cognitoUserSession?: CognitoUserSession;
  error?: Error;
}
