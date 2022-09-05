import { Injectable } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  PasswordChangeResponse,
  SignUpRequest,
  SignUpResponse,
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

  currentUser(): CognitoUser {
    return this.userPool().getCurrentUser();
  }

  userByEmail(email: string): CognitoUser {
    return new CognitoUser({
      Username: email,
      Pool: this.userPool(),
    });
  }

  token(): Observable<string> {
    return new Observable<string>((observer) => {
      this.currentUser()?.getSession((error, session) => {
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
    return new Observable<boolean>((observer) => {
      this.currentUser()?.getSession((error, session) => {
        if (error) {
          observer.error(error);
          return;
        }
        observer.next(session?.isValid());
        observer.complete();
      });
    });
  }

  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    const givenNameAttribute = new CognitoUserAttribute({
      Name: 'given_name',
      Value: request.firstName,
    });
    const familyNameAttribute = new CognitoUserAttribute({
      Name: 'family_name',
      Value: request.lastName,
    });
    const attributeList: CognitoUserAttribute[] = [
      givenNameAttribute,
      familyNameAttribute,
    ];

    return new Observable<SignUpResponse>((observer) => {
      this.userPool().signUp(
        request.email,
        request.newPassword,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            observer.next({ error: err });
          } else {
            observer.next({ user: result.user });
            observer.complete();
          }
        }
      );
    });
  }

  logIn(request: LoginRequest): Observable<LoginResponse> {
    const authDetails = new AuthenticationDetails({
      Username: request.email,
      Password: request.password,
    });

    return new Observable<LoginResponse>((observer) => {
      this.userByEmail(request.email).authenticateUser(authDetails, {
        onSuccess(session: CognitoUserSession) {
          observer.next({ isVerified: true, email: request.email, session });
          observer.complete();
        },
        onFailure(err) {
          if (`${err}` === 'UserNotConfirmedException: User is not confirmed.') {
            observer.next({ isVerified: false, email: request.email });
            observer.complete();
          }

          let errorMessage: string;
          switch (`${err}`) {
            case 'NotAuthorizedException: Incorrect username or password.':
              errorMessage = '[Auth] Incorrect username or password';
              break;
            case 'NotAuthorizedException: Password attempts exceeded':
              errorMessage = '[Auth] Password attempt limit exceeded';
              break;
            case 'CodeMismatchException: Invalid verification code provided, please try again.':
              errorMessage = '[Auth] Invalid verification code';
              break;
            default:
              errorMessage = `[Auth] ${err}`;
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
    return new Observable<PasswordChangeResponse>((observer) => {
      this.userByEmail(email).forgotPassword({
        onSuccess(data: string) {
          observer.next();
          observer.complete();
        },
        onFailure(err) {
          let errorMessage: string;
          switch (`${err}`) {
            case 'LimitExceededException: Attempt limit exceeded, please try after some time.':
              errorMessage = '[Auth] Code attempt limit reached; please try again later';
              break;
            default:
              errorMessage = `[Auth] ${err}`;
          }
          observer.next({ error: new Error(errorMessage) });
        },
      });
    });
  }

  changePassword(request: PasswordChangeRequest): Observable<PasswordChangeResponse> {
    return new Observable<PasswordChangeResponse>((observer) => {
      this.userByEmail(request.email).confirmPassword(request.code, request.newPassword, {
        onSuccess(success: string) {
          observer.next(null);
          observer.complete();
        },
        onFailure(err) {
          let errorMessage: string;
          switch (`${err}`) {
            case 'CodeMismatchException: Invalid verification code provided, please try again.':
              errorMessage = '[Auth] Invalid verification code';
              break;
            default:
              errorMessage = `[Auth] ${err}`;
          }
          observer.next({ error: new Error(errorMessage) });
        },
      });
    });
  }

  resendVerificationLink(): void {
    /**
     * Configured in AWS to only send email to the user (no SMS);
     * Note: no callback function configured - it's simply assumed that this email gets sent
     */
    this.currentUser()?.resendConfirmationCode(() => null);
  }
}
