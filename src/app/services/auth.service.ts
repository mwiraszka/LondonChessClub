import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import {
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
} from '@app/types';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userPool(): CognitoUserPool {
    return new CognitoUserPool({
      UserPoolId: environment.cognito.userPoolId,
      ClientId: environment.cognito.clientId,
    });
  }

  currentUser(): CognitoUser | null {
    return this.userPool().getCurrentUser();
  }

  userByEmail(email: string): CognitoUser {
    return new CognitoUser({
      Username: email,
      Pool: this.userPool(),
    });
  }

  token(): Observable<string> {
    return new Observable<string>(observer => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.currentUser()?.getSession((error: Error, session: any) => {
        if (error) {
          observer.error(error);
          return;
        }
        observer.next(session.getIdToken().getJwtToken());
        observer.complete();
      });
    });
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.currentUser()?.getSession((error: Error, session: any) => {
        if (error) {
          observer.error(error);
          return;
        }
        observer.next(session?.isValid());
        observer.complete();
      });
    });
  }

  logIn(request: LoginRequest): Observable<LoginResponse> {
    const authDetails = new AuthenticationDetails({
      Username: request.email,
      Password: request.password,
    });

    return new Observable<LoginResponse>(observer => {
      this.userByEmail(request.email).authenticateUser(authDetails, {
        onSuccess(session: CognitoUserSession) {
          observer.next({ isVerified: true, email: request.email, session });
          observer.complete();
        },
        onFailure(err) {
          let errorMessage: string;
          switch (`${err}`) {
            case 'NotAuthorizedException: Incorrect username or password.':
              errorMessage = 'Incorrect username or password';
              break;
            case 'NotAuthorizedException: Password attempts exceeded':
              errorMessage = 'Password attempt limit exceeded';
              break;
            case 'UserNotConfirmedException: User is not confirmed.':
              errorMessage =
                'Please verify your account by clicking on the link that was sent to your email';
              break;
            default:
              errorMessage = `Unknown error: ${err}`;
          }
          observer.next({ error: new Error(errorMessage) });
        },
      });
    });
  }

  logOut(): void {
    this.currentUser()?.signOut();
  }

  sendChangePasswordCode(email: string): Observable<PasswordChangeResponse> {
    return new Observable<PasswordChangeResponse>(observer => {
      this.userByEmail(email).forgotPassword({
        onSuccess() {
          observer.next();
          observer.complete();
        },
        onFailure(err) {
          let errorMessage: string;
          switch (`${err}`) {
            case 'LimitExceededException: Attempt limit exceeded, please try after some time.':
              errorMessage = 'Code attempt limit reached; please try again later';
              break;
            default:
              errorMessage = `Unknown error: ${err}`;
          }
          observer.next({ error: new Error(errorMessage) });
        },
      });
    });
  }

  changePassword(
    request: PasswordChangeRequest,
  ): Observable<PasswordChangeResponse | null> {
    return new Observable<PasswordChangeResponse | null>(observer => {
      this.userByEmail(request.email).confirmPassword(request.code, request.newPassword, {
        onSuccess() {
          observer.next({ email: request.email, newPassword: request.newPassword });
          observer.complete();
        },
        onFailure(err) {
          let errorMessage: string;
          switch (`${err}`) {
            case 'CodeMismatchException: Invalid verification code provided, please try again.':
            case 'ExpiredCodeException: Invalid code provided, please request a code again.':
              errorMessage = 'Invalid verification code';
              break;
            case 'LimitExceededException: Attempt limit exceeded, please try after some time.':
              errorMessage =
                'Password change attempt limit reached; please try again later';
              break;
            default:
              errorMessage = `Unknown error: ${err}`;
          }
          observer.next({ error: new Error(errorMessage) });
        },
      });
    });
  }
}
