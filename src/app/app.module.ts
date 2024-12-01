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
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from '@app/app-routing.module';
import { FooterComponent } from '@app/components/footer/footer.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { ImageOverlayModule } from '@app/components/image-overlay';
import { ModalModule } from '@app/components/modal';
import { NavModule } from '@app/components/nav';
import { ToasterModule } from '@app/components/toaster';
import { UpcomingEventBannerModule } from '@app/components/upcoming-event-banner';
import { metaReducers } from '@app/store/app';
import { ArticlesStoreModule } from '@app/store/articles';
import { AuthStoreModule } from '@app/store/auth';
import { MembersStoreModule } from '@app/store/members';
import { ModalStoreModule } from '@app/store/modal';
import { NavStoreModule } from '@app/store/nav';
import { PhotosStoreModule } from '@app/store/photos';
import { ScheduleStoreModule } from '@app/store/schedule';
import { ToasterStoreModule } from '@app/store/toaster';
import { UserSettingsStoreModule } from '@app/store/user-settings';
import { actionSanitizer } from '@app/utils';

import { environment } from '@environments/environment';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    ArticlesStoreModule,
    AuthStoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([]),
    FooterComponent,
    HeaderComponent,
    ImageOverlayModule,
    PhotosStoreModule,
    MarkdownModule.forRoot(),
    MembersStoreModule,
    ModalModule,
    ModalStoreModule,
    NavModule,
    NavStoreModule,
    ScheduleStoreModule,
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
    ToasterModule,
    ToasterStoreModule,
    UpcomingEventBannerModule,
    UserSettingsStoreModule,
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
  ],
})
export class AppModule {}
