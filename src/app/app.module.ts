import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ClarityModule } from '@clr/angular';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from '@app/app-routing.module';
import { AlertModule } from '@app/components/alert';
import { FooterModule } from '@app/components/footer';
import { HeaderModule } from '@app/components/header';
import { ImageOverlayModule } from '@app/components/image-overlay';
import { ModalModule } from '@app/components/modal';
import { NavModule } from '@app/components/nav';
import { ToasterModule } from '@app/components/toaster';
import { ScreensModule } from '@app/screens/screens.module';
import { metaReducers } from '@app/store';
import { ArticlesStoreModule } from '@app/store/articles';
import { AuthStoreModule } from '@app/store/auth';
import { ImageOverlayStoreModule } from '@app/store/image-overlay';
import { MembersStoreModule } from '@app/store/members';
import { ModalStoreModule } from '@app/store/modal';
import { NavStoreModule } from '@app/store/nav';
import { ScheduleStoreModule } from '@app/store/schedule';
import { ToasterStoreModule } from '@app/store/toaster';
import { environment } from '@environments/environment';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AlertModule,
    AppRoutingModule,
    ArticlesStoreModule,
    AuthStoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    EffectsModule.forRoot([]),
    FooterModule,
    HeaderModule,
    HttpClientModule,
    ImageOverlayModule,
    ImageOverlayStoreModule,
    MembersStoreModule,
    ModalModule,
    ModalStoreModule,
    NavModule,
    NavStoreModule,
    ScheduleStoreModule,
    ScreensModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    StoreModule.forRoot({ router: routerReducer }, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    ToasterModule,
    ToasterStoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
