import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import {
  CaptchaConfiguration,
  Configuration,
  OutageInformation
} from '../api/models';
import { ConfigurationService } from '../api/services';
import { EnvironmentInformation } from '../model/environment-information.model';
import { AlertService } from './alert.service';
import { CacheService } from './cache.service';
import * as globalConst from '../services/globalConstants';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public environmentBanner: EnvironmentInformation;
  private configurationGetEnvironmentInfoPath = '/env/info.json';

  public get configuration(): Configuration {
    return JSON.parse(this.cacheService.get('configuration'));
  }

  public set configuration(v: Configuration) {
    this.cacheService.set('configuration', v);
  }

  constructor(
    public configurationService: ConfigurationService,
    public cacheService: CacheService,
    public http: HttpClient,
    public alertService: AlertService,
    @Inject(APP_BASE_HREF) public baseHref: string
  ) {}

  public async loadConfig(): Promise<Configuration> {
    if (this.configuration !== null) {
      return this.configuration;
    }

    const config$ = this.configurationService
      .configurationGetConfiguration()
      .pipe(
        tap((c: Configuration) => {
          this.configuration = c;
        })
      );

    return lastValueFrom(config$);
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

  public loadEnvironmentBanner(): Promise<EnvironmentInformation> {
    return new Promise<EnvironmentInformation>((resolve, reject) => {
      let environment: EnvironmentInformation = {};
      this.getEnvironment().subscribe({
        next: (env) => {
          environment = env;
          this.setEnvironmentBanner(env);
          resolve(environment);
        },
        error: (error) => {
          if (error.status === 400 || error.status === 404) {
            this.environmentBanner = null;
          } else {
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.systemError);
          }
          reject(error);
        }
      });
    });
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

  public getOutageConfiguration(): Observable<OutageInformation> {
    return this.configurationService.configurationGetOutageInfo();
  }

  public getCaptchaConfiguration(): CaptchaConfiguration {
    return this.configuration.captcha;
  }

  private getEnvironmentInfo(): EnvironmentInformation {
    let environment: EnvironmentInformation = {};
    this.getEnvironment().subscribe({
      next: (env) => {
        environment = env;
        this.setEnvironmentBanner(env);
      },
      error: (error) => {
        if (error.status === 400 || error.status === 404) {
          this.environmentBanner = null;
        } else {
          this.alertService.clearAlert();
          this.alertService.setAlert('danger', globalConst.systemError);
        }
      }
    });
    return environment;
  }

  private getEnvironment(): Observable<EnvironmentInformation> {
    const envUrl = this.configurationGetEnvironmentInfoPath;
    return this.http.get(envUrl);
  }
}
