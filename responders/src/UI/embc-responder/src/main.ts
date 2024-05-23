import { enableProdMode, InjectionToken, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { computeInterfaceToken } from './app/app.module';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { ErrorHandlingModule } from './app/shared/error-handling/error-handing.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ApiModule } from './app/core/api/api.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CoreModule } from './app/core/core.module';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ComputeWizardService } from './app/core/services/compute/computeWizard.service';
import { ComputeFeaturesService } from './app/core/services/compute/computeFeatures.service';
import { Compute } from './app/core/interfaces/compute';
import { DatePipe } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      CoreModule,
      OAuthModule.forRoot({
        resourceServer: {
          customUrlValidation: (url) => url.startsWith('/api') && !url.endsWith('/configuration'),
          sendAccessToken: true
        }
      }),
      ApiModule.forRoot({ rootUrl: '' }),
      NgIdleKeepaliveModule.forRoot(),
      ErrorHandlingModule.forRoot()
    ),
    DatePipe,
    {
      provide: computeInterfaceToken,
      useClass: ComputeFeaturesService,
      multi: true
    },
    {
      provide: computeInterfaceToken,
      useClass: ComputeWizardService,
      multi: true
    },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideNativeDateAdapter()
  ]
}).catch((err) => console.error(err));
