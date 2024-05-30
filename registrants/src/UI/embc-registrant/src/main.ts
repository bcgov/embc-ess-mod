import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ApiModule } from './app/core/api/api.module';
import { CoreModule } from './app/core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app-routing.module';
import { withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { provideMarkdown } from 'ngx-markdown';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        canceledNavigationResolution: 'computed'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top'
      })
    ),
    importProvidersFrom(
      BrowserModule,
      ReactiveFormsModule,
      CoreModule,
      ApiModule.forRoot({ rootUrl: '.' }),
      NgIdleKeepaliveModule.forRoot(),
      OAuthModule.forRoot({
        resourceServer: {
          sendAccessToken: true,
          customUrlValidation: (url) =>
            url.toLowerCase().includes('/api/') && !url.toLowerCase().endsWith('/configuration')
        }
      })
    ),
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => {
        let result = s.getBaseHrefFromDOM();
        if (result[result.length - 1] === '/') {
          result = result.substring(0, result.length - 1);
        }
        return result;
      },
      deps: [PlatformLocation]
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideMarkdown({ loader: HttpClient }),
    provideNativeDateAdapter()
  ]
}).catch((err) => console.error(err));
