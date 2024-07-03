import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import type {
  AdminUser,
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
  UnverifiedUser,
} from '@app/types';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userPool: CognitoUserPool;
  currentUser: CognitoUser | null;

  protected tempInitialPassword = '';

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: environment.aws.cognitoUserPool.userPoolId,
      ClientId: environment.aws.cognitoUserPool.clientId,
    });

    this.currentUser = this.userPool.getCurrentUser();
  }

  public token(): Observable<string> {
    return new Observable<string>((observer) => {
      this.currentUser?.getSession((error: Error, session: CognitoUserSession | null) => {
        if (error) {
          observer.error(`Error getting Cognito user session: ${error}`);
        }

        if (!session) {
          observer.error('Could not find Cognito user session');
        }

        observer.next(session!.getIdToken().getJwtToken());
        observer.complete();
      });
    });
  }

  public logIn(request: LoginRequest): Observable<LoginResponse> {
    const authenticationDetails = new AuthenticationDetails({
      Username: request.email,
      Password: request.tempInitialPassword ?? request.password,
    });

    return new Observable<LoginResponse>((observer) => {
      const user = this.userByEmail(request.email);

      user.authenticateUser(authenticationDetails, {
        onSuccess(session: CognitoUserSession) {
          const idTokenPayload = session.getIdToken().decodePayload();
          const adminUser: AdminUser = {
            firstName: idTokenPayload['given_name'],
            lastName: idTokenPayload['family_name'],
            email: idTokenPayload['email'],
            isVerified: true,
          };
          observer.next({ adminUser });
          observer.complete();
        },

        newPasswordRequired(userAttributes) {
          if (!userAttributes.given_name || !userAttributes.family_name) {
            observer.next({
              error: new Error(
                'Admin user attributes not set - please contact the LCC root administrator.'
              ),
            });
            observer.complete();
          }

          if (request.tempInitialPassword) {
            delete userAttributes.email;
            delete userAttributes.email_verified;
            delete userAttributes.phone_number_verified;

            user.completeNewPasswordChallenge(request.password, userAttributes, {
              onSuccess(session: CognitoUserSession) {
                const idTokenPayload = session.getIdToken().decodePayload();
                const adminUser: AdminUser = {
                  firstName: idTokenPayload['given_name'],
                  lastName: idTokenPayload['family_name'],
                  email: idTokenPayload['email'],
                  isVerified: true,
                };
                observer.next({ adminUser });
                observer.complete();
              },
              onFailure(error) {
                observer.next({ error: new Error(`Unknown error: ${error}`) });
                observer.complete();
              },
            });
          } else {
            const unverifiedUser: UnverifiedUser = {
              firstName: userAttributes.given_name,
              lastName: userAttributes.family_name,
              email: userAttributes.email,
              isVerified: false,
            };
            observer.next({ unverifiedUser, tempInitialPassword: request.password });
            observer.complete();
          }
        },

        onFailure(error) {
          let errorMessage: string;
          switch (error?.message ?? error) {
            case 'Incorrect username or password.':
              errorMessage = 'Incorrect username or password.';
              break;
            case 'Password attempts exceeded':
              errorMessage = 'Password attempt limit exceeded.';
              break;
            case 'User is not confirmed.':
              errorMessage =
                'Please verify your account by clicking on the link that was sent to your email.';
              break;
            default:
              errorMessage = `Unknown error: ${error}`;
          }
          observer.next({ error: new Error(errorMessage) });
          observer.complete();
        },
      });
    });
  }

  public logOut(): void {
    this.currentUser?.signOut();
  }

  public sendChangePasswordCode(email: string): Observable<PasswordChangeResponse> {
    return new Observable<PasswordChangeResponse>((observer) => {
      this.userByEmail(email).forgotPassword({
        onSuccess() {
          observer.next();
          observer.complete();
        },

        onFailure(error: Error) {
          let errorMessage: string;
          switch (error.message) {
            case 'Attempt limit exceeded, please try after some time.':
              errorMessage = 'Code attempt limit reached; please try again later.';
              break;
            default:
              errorMessage = `Unknown error: ${error}`;
          }
          observer.next({ error: new Error(errorMessage) });
          observer.complete();
        },
      });
    });
  }

  public changePassword(
    request: PasswordChangeRequest
  ): Observable<PasswordChangeResponse | null> {
    return new Observable<PasswordChangeResponse | null>((observer) => {
      this.userByEmail(request.email).confirmPassword(request.code, request.newPassword, {
        onSuccess() {
          observer.next({ email: request.email, newPassword: request.newPassword });
          observer.complete();
        },

        onFailure(error: Error) {
          let errorMessage: string;
          switch (error.message) {
            case 'Invalid verification code provided, please try again.':
            case 'Invalid code provided, please request a code again.':
              errorMessage = 'Invalid verification code.';
              break;
            case 'Attempt limit exceeded, please try after some time.':
              errorMessage =
                'Password change attempt limit reached; please try again later.';
              break;
            default:
              errorMessage = `Unknown error: ${error.message}`;
          }
          observer.next({ error: new Error(errorMessage) });
          observer.complete();
        },
      });
    });
  }

  private userByEmail(email: string): CognitoUser {
    return new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });
  }
}
