import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { BehaviorSubject, from, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { User } from '@app/shared/types';

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  signUp(username, password): Observable<any> {
    return from(Auth.signUp(username, password));
  }

  confirmSignUp(user: IUser): Observable<any> {
    return from(Auth.confirmSignUp(user.email, user.code));
  }

  signIn(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password).then(() => {
      this.authenticationSubject.next(true);
    });
  }

  signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.authenticationSubject.next(false);
    });
  }

  isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
        .then((user: any) => {
          return !!user;
        })
        .catch(() => {
          return false;
        });
    }
  }

  getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser().then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }
}
