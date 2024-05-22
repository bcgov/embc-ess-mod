import { enableProdMode, importProvidersFrom } from '@angular/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      ReactiveFormsModule,
      OAuthModule.forRoot({
        resourceServer: {
          customUrlValidation: (url) => url.startsWith('/api') && !url.endsWith('/Config'),
          sendAccessToken: true
        }
      })
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
}).catch((err) => console.error(err));
