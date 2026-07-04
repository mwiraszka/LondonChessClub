import { Clerk } from '@clerk/clerk-js';

import { Injectable } from '@angular/core';

import { User } from '@app/models';

import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class ClerkService {
  private clerk: Clerk | null = null;

  public async load(): Promise<void> {
    this.clerk = new Clerk(environment.clerkPublishableKey);
    await this.clerk.load();
  }

  public getCurrentUser(): User | null {
    const clerkUser = this.requireClerk().user;
    return clerkUser ? this.mapUser(clerkUser) : null;
  }

  public async logIn(email: string, password: string): Promise<User> {
    const signIn = await this.requireClerk().client!.signIn.create({
      strategy: 'password',
      identifier: email,
      password,
    });

    if (signIn.status !== 'complete') {
      throw new Error('Additional verification is required to complete sign-in');
    }

    await this.requireClerk().setActive({ session: signIn.createdSessionId });
    return this.getCurrentUser()!;
  }

  // Full-page OAuth redirect; control returns to the app at /sso-callback.
  public async continueWithGoogle(): Promise<void> {
    await this.requireClerk().client!.signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    });
  }

  public async handleSsoCallback(): Promise<User> {
    await this.requireClerk().handleRedirectCallback({});

    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Sign-in did not complete');
    }
    return user;
  }

  public async logOut(): Promise<void> {
    await this.requireClerk().signOut();
  }

  public getToken(): Promise<string | null> {
    const session = this.requireClerk().session;
    return session ? session.getToken() : Promise.resolve(null);
  }

  private mapUser(clerkUser: NonNullable<Clerk['user']>): User {
    return {
      id: clerkUser.id,
      firstName: clerkUser.firstName ?? '',
      lastName: clerkUser.lastName ?? '',
      email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
      // Self-signup is disabled, so any authenticated Clerk user is the club admin.
      isAdmin: true,
    };
  }

  private requireClerk(): Clerk {
    if (!this.clerk) {
      throw new Error('Clerk has not been loaded yet');
    }
    return this.clerk;
  }
}
