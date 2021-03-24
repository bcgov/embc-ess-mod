import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule, OAuthResourceServerErrorHandler } from 'angular-oauth2-oidc';
import { AuthService, OAuthNoopResourceServerErrorHandler } from './core/services/auth.service';
import { ApiModule } from './core/api/api.module';
import { ConfigService } from './core/services/config.service';

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
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['/api'],
        sendAccessToken: true
      }
    }),
    ApiModule.forRoot({ rootUrl: '' })
  ],
  providers: [
    AuthService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.ensureLoggedIn(),
      deps: [AuthService],
      multi: true
    },
    {
      provide: OAuthResourceServerErrorHandler,
      useClass: OAuthNoopResourceServerErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
