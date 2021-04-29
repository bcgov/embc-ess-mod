import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ApiModule } from './core/api/api.module';
import { ErrorHandlingModule } from './shared/error-handling/error-handing.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        customUrlValidation: (url) =>
          url.startsWith('/api') && !url.endsWith('/configuration'),
        sendAccessToken: true
      }
    }),
    ApiModule.forRoot({ rootUrl: '' }),
    ErrorHandlingModule.forRoot(),
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
