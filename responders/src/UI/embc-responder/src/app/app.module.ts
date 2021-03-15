import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { AuthService } from './core/services/auth.service';
import { authConfig } from './core/services/authConfig';
import { ApiModule } from './core/api/api.module';

export const initialize = (authService: AuthService) => () => authService.ensureLoggedIn();

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    ApiModule.forRoot({ rootUrl: '' })
  ],
  providers: [
    AuthService,
    {
      provide: AuthConfig,
      useValue: authConfig
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
