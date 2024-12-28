import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { Action, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MarkdownModule } from 'ngx-markdown';

import {
  provideHttpClient,
  withInterceptorsFromDi,
  withJsonpSupport,
} from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppStoreModule } from '@app/store/app';
import { ArticlesStoreModule } from '@app/store/articles';
import { AuthStoreModule } from '@app/store/auth';
import { EventsStoreModule } from '@app/store/events';
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
      MarkdownModule.forRoot(),
      MembersStoreModule,
      NavStoreModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first)
        registrationStrategy: 'registerWhenStable:30000',
      }),
      StoreModule.forRoot<MetaState, Action<string>>(
        { router: routerReducer },
        {
          metaReducers,
          runtimeChecks: {
            strictStateSerializability: true,
            // TODO: Re-enable once HttpErrorResponse replaced with a serializable type
            strictActionSerializability: false,
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
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
    provideAnimations(),
  ],
}).catch(error => console.error(`[LCC] Bootstrap error: ${error}`));
