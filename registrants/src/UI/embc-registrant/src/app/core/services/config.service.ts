import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Configuration, OidcOptions } from '../api/models';
import { ConfigurationService } from '../api/services';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private get configuration(): Configuration {
    return this.cacheService.get('configuration');
  }

  private set configuration(v: Configuration) {
    this.cacheService.set('configuration', v);
  }

  constructor(
    private configurationService: ConfigurationService,
    private cacheService: CacheService,
    @Inject(APP_BASE_HREF) public baseHref: string
  ) { }

  public async loadConfig(): Promise<Configuration> {
    await this.configurationService
      .configurationGetConfiguration()
      .toPromise()
      .then((config: Configuration) => {
        this.configuration = config;
      });
    return this.configuration;
  }

  public getOAuthConfig(): AuthConfig {
    const config = this.configuration;
    if (!config) throw new Error('Configuration was not loaded');
    return {
      requestAccessToken: true,
      issuer: config.oidc?.issuer || undefined,
      clientId: config.oidc?.clientId || undefined,
      redirectUri: window.location.origin + this.baseHref, // concat base href to the redirect URI
      responseType: 'code',
      scope: config.oidc?.scope || undefined,
      showDebugInformation: true, //!environment.production,
      customQueryParams: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'idp:bcsc'
      }
    };
  }
}
