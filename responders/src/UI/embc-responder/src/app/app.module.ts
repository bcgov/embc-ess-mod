import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { AuthService } from './core/services/auth.service';
import { authConfig, OAuthModuleConfig } from './core/services/authConfig';

export function initialize(authService: AuthService): () => Promise<any> {
  return () => authService.initiateAuthentication();
}

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
    OAuthModule.forRoot()
  ],
  providers: [
    AuthService,
    { provide: AuthConfig, useValue: authConfig },
    OAuthModuleConfig,
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
