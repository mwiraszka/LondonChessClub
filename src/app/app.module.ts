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
import { AppComponent } from '@app/app.component';
import { CoreModule } from '@app/core/core.module';
import { ScreensModule } from '@app/screens/screens.module';
import { AdminControlsModule } from '@app/shared/components/admin-controls';
import { AlertModule } from '@app/shared/components/alert';
import { ImageOverlayModule } from '@app/shared/components/image-overlay';
import { LinkListModule } from '@app/shared/components/link-list';
import { ModalModule } from '@app/shared/components/modal';
import { ToastModule } from '@app/shared/components/toast';
import { ToasterModule } from '@app/shared/components/toaster';
import { metaReducers } from '@app/shared/store';
import { environment } from '@environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AdminControlsModule,
    AlertModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    CoreModule,
    EffectsModule.forRoot([]),
    HttpClientModule,
    ImageOverlayModule,
    LinkListModule,
    ModalModule,
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
    ToastModule,
    ToasterModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
