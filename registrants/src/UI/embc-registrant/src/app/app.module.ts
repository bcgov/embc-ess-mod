import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { ApiModule } from './core/api/api.module';
import { OAuthModule } from 'angular-oauth2-oidc';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { OutageBannerComponent } from './sharedModules/outage-components/outage-banner/outage-banner.component';
import { OutageDialogComponent } from './sharedModules/outage-components/outage-dialog/outage-dialog.component';

@NgModule({
  declarations: [AppComponent, OutageBannerComponent, OutageDialogComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CoreModule,
    ApiModule.forRoot({ rootUrl: '.' }),
    NgIdleKeepaliveModule.forRoot(),
    OAuthModule.forRoot({
      resourceServer: {
        sendAccessToken: true,
        customUrlValidation: (url) =>
          url.toLowerCase().includes('/api/') &&
          !url.toLowerCase().endsWith('/configuration')
      }
    })
  ],
  providers: [
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
