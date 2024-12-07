import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
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
import { metaReducers } from '@app/store/app';
import { ArticlesStoreModule } from '@app/store/articles';
import { AuthStoreModule } from '@app/store/auth';
import { EventsStoreModule } from '@app/store/events';
import { MembersStoreModule } from '@app/store/members';
import { ModalStoreModule } from '@app/store/modal';
import { NavStoreModule } from '@app/store/nav';
import { PhotosStoreModule } from '@app/store/photos';
import { ToasterStoreModule } from '@app/store/toaster';
import { UserSettingsStoreModule } from '@app/store/user-settings';
import { actionSanitizer } from '@app/utils';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      AppRoutingModule,
      ArticlesStoreModule,
      AuthStoreModule,
      BrowserModule,
      EffectsModule.forRoot([]),
      EventsStoreModule,
      MarkdownModule.forRoot(),
      MembersStoreModule,
      ModalStoreModule,
      NavStoreModule,
      PhotosStoreModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first)
        registrationStrategy: 'registerWhenStable:30000',
      }),
      StoreModule.forRoot({ router: routerReducer }, { metaReducers }),
      StoreRouterConnectingModule.forRoot(),
      StoreDevtoolsModule.instrument({
        name: 'London Chess Club - NgRx Store DevTools',
        logOnly: environment.production,
        maxAge: 100,
        actionSanitizer,
      }),
      ToasterStoreModule,
      UserSettingsStoreModule,
    ),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
    provideAnimations(),
  ],
}).catch(error => console.error(`[LCC] Bootstrap error: ${error}`));
