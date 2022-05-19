import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { Observable, of } from 'rxjs';
import { LoginRequest } from './types/login-request.model';
import { LoginResponse } from './types/login-response.model';
import { SignUpRequest } from './types/sign-up-request.model';
import { SignUpResponse } from './types/sign-up-response.model';

const userPool = new CognitoUserPool({
  UserPoolId: environment.cognito.userPoolId,
  ClientId: environment.cognito.clientId,
});

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getAuthenticatedUser(): CognitoUser {
    return userPool.getCurrentUser();
  }

  getToken(): Observable<string> {
    return new Observable<string>((observer) => {
      this.getAuthenticatedUser().getSession((err, session) => {
        if (err) {
          observer.error(err);
          return;
        }
        observer.next(session.getIdToken().getJwtToken());
        observer.complete();
      });
    });
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.getAuthenticatedUser().getSession((err, session) => {
        observer.next(session?.isValid());
        observer.complete();
      });
    });
  }

  signUp(signUpRequest: SignUpRequest): Observable<SignUpResponse> {
    const givenNameAttribute = new CognitoUserAttribute({
      Name: 'given_name',
      Value: signUpRequest.firstName,
    });
    const familyNameAttribute = new CognitoUserAttribute({
      Name: 'family_name',
      Value: signUpRequest.lastName,
    });
    const attributeList: CognitoUserAttribute[] = [
      givenNameAttribute,
      familyNameAttribute,
    ];

    return new Observable<SignUpResponse>((observer) => {
      userPool.signUp(
        signUpRequest.email,
        signUpRequest.password,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            observer.next({ error: err });
          } else {
            observer.next({ cognitoUser: result.user });
            observer.complete();
          }
        }
      );
    });
  }

  logIn(loginRequest: LoginRequest): Observable<LoginResponse> {
    const authDetails = new AuthenticationDetails({
      Username: loginRequest.email,
      Password: loginRequest.password,
    });

    const cognitoUser = new CognitoUser({
      Username: loginRequest.email,
      Pool: userPool,
    });

    return new Observable<LoginResponse>((observer) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess(cognitoUserSession: CognitoUserSession) {
          observer.next({ cognitoUserSession });
          observer.complete();
        },
        onFailure(err) {
          observer.next({ error: err });
        },
      });
    });
  }

  logOut(): void {
    this.getAuthenticatedUser().signOut();
  }
}
