import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { BehaviorSubject, from, Observable } from 'rxjs';

import { environment } from '@environments/environment';

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

  signUp(email: string, password: string): Observable<any> {
    return from(Auth.signUp(email, password));
  }

  confirmSignUp(email: string, code: string): Observable<any> {
    return from(Auth.confirmSignUp(email, code));
  }

  signIn(email: string, password: string): Promise<any> {
    return Auth.signIn(email, password).then(() => {
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
}
