import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

export interface SignUpResponse {
  user?: CognitoUser;
  session?: CognitoUserSession;
  error?: Error;
}
