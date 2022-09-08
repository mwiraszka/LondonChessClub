import { Injectable } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  UserData,
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

  // TODO: Implement once user logged in (must be authenticated) to
  // fetch Cognito User data (first name, isAdmin, etc.)?
  userData(): Observable<UserData | Error> {
    return new Observable<UserData | Error>((observer) => {
      this.currentUser()?.getUserData((error, data) => {
        if (error) {
          observer.error(error);
          return;
        }
        if (data) {
        }
        observer.next(data);
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

  /**
   * Currently not hooked up in UI, but code is fully functional;
   * here for future reference in case we decide to re-implement it
   */
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
          let errorMessage: string;
          switch (`${err}`) {
            case 'NotAuthorizedException: Incorrect username or password.':
              errorMessage = '[Auth] Incorrect username or password';
              break;
            case 'NotAuthorizedException: Password attempts exceeded':
              errorMessage = '[Auth] Password attempt limit exceeded';
              break;
            case 'UserNotConfirmedException: User is not confirmed.':
              errorMessage =
                '[Auth] Please verify your account by clicking on the link that was sent to your email';
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
            case 'ExpiredCodeException: Invalid code provided, please request a code again.':
              errorMessage = '[Auth] Invalid verification code';
              break;
            case 'LimitExceededException: Attempt limit exceeded, please try after some time.':
              errorMessage =
                '[Auth] Password change attempt limit reached; please try again later';
              break;
            default:
              errorMessage = `[Auth] ${err}`;
          }
          observer.next({ error: new Error(errorMessage) });
        },
      });
    });
  }
}
