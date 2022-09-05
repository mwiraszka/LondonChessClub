import { CognitoUserSession } from 'amazon-cognito-identity-js';

export interface LoginResponse {
  isVerified?: boolean;
  firstName?: string;
  email?: string;
  session?: CognitoUserSession;
  error?: Error;
}
