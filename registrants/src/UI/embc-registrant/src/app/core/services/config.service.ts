import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { Configuration } from '../api/models';
import { ConfigurationService } from '../api/services';
import { EnvironmentInformation } from '../model/environment-information.model';
import { AlertService } from './alert.service';
import { CacheService } from './cache.service';
import * as globalConst from '../services/globalConstants';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private get configuration(): Configuration {
    return JSON.parse(this.cacheService.get('configuration'));
  }

  private set configuration(v: Configuration) {
    this.cacheService.set('configuration', v);
  }

  private configurationGetEnvironmentInfoPath = '/env/info.json';
  private environmentBanner: EnvironmentInformation;

  constructor(
    private configurationService: ConfigurationService,
    private cacheService: CacheService,
    private http: HttpClient,
    private alertService: AlertService,
    @Inject(APP_BASE_HREF) public baseHref: string
  ) {}

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

  public async loadEnvironmentBanner(): Promise<EnvironmentInformation> {
    const callEnv$ = this.getEnvironment().pipe(
      tap((env) => {
        this.setEnvironmentBanner(env);
      })
    );

    const envResult = await lastValueFrom(callEnv$);
    return envResult;
  }

  public getEnvironmentBanner(): EnvironmentInformation {
    return this.environmentBanner
      ? this.environmentBanner
      : JSON.parse(this.cacheService.get('environment'))
      ? JSON.parse(this.cacheService.get('environment'))
      : this.getEnvironmentInfo();
  }

  public setEnvironmentBanner(environmentBanner: EnvironmentInformation): void {
    this.environmentBanner = environmentBanner;
    this.cacheService.set('environment', environmentBanner);
  }

  private getEnvironmentInfo(): EnvironmentInformation {
    let environment: EnvironmentInformation = {};
    this.getEnvironment().subscribe({
      next: (env) => {
        environment = env;
        this.setEnvironmentBanner(env);
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.systemError);
      }
    });
    return environment;
  }

  private getEnvironment(): Observable<EnvironmentInformation> {
    const envUrl = this.configurationGetEnvironmentInfoPath;
    return this.http.get(envUrl);
  }
}
