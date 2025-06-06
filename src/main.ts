import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { Action, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MarkdownModule } from 'ngx-markdown';

import {
  provideHttpClient,
  withInterceptorsFromDi,
  withJsonpSupport,
} from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppRoutingModule } from '@app/app-routing.module';
import { AuthInterceptorProvider, LoggingInterceptorProvider } from '@app/interceptors';
import { AppStoreModule } from '@app/store/app';
import { ArticlesStoreModule } from '@app/store/articles';
import { AuthStoreModule } from '@app/store/auth';
import { EventsStoreModule } from '@app/store/events';
import { ImagesStoreModule } from '@app/store/images';
import { MembersStoreModule } from '@app/store/members';
import { MetaState, metaReducers } from '@app/store/meta-reducers';
import { NavStoreModule } from '@app/store/nav';
import { actionSanitizer } from '@app/utils';

import { environment } from '@env';

import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      AppRoutingModule,
      AppStoreModule,
      ArticlesStoreModule,
      AuthStoreModule,
      BrowserModule,
      EffectsModule.forRoot([]),
      EventsStoreModule,
      ImagesStoreModule,
      MarkdownModule.forRoot(),
      MembersStoreModule,
      NavStoreModule,
      StoreModule.forRoot<MetaState, Action<string>>(
        { routerState: routerReducer },
        {
          metaReducers,
          runtimeChecks: {
            strictStateSerializability: true,
            strictActionSerializability: true,
          },
        },
      ),
      StoreRouterConnectingModule.forRoot(),
      StoreDevtoolsModule.instrument({
        name: 'London Chess Club - NgRx Store DevTools',
        logOnly: environment.production,
        maxAge: 100,
        actionSanitizer,
      }),
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
    AuthInterceptorProvider,
    LoggingInterceptorProvider,
  ],
}).catch(error => console.error(`[LCC] Bootstrap error: ${error}`));
